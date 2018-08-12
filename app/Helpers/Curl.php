<?php
namespace App\Helpers;

class Curl
{
    public function __construct()
    {
        error_reporting(E_ERROR);
        set_time_limit(0);
    }

    public static function makeCall($options = [])
    {
        $curl = self::initCurl($options);

        $res = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if (!$err) {
            return $res;
        } else {
            return ['success' => false, 'message' => $err];
        }
    }

    public static function initCurl($options = [])
    {
        $method     = isset($options['method']) ? strtoupper($options['method']) : 'GET';
        $url        = isset($options['url']) ? $options['url'] : 'http://example.com/';
        $headers    = isset($options['headers']) ? $options['headers'] : [];
        $body       = isset($options['body']) ? $options['body'] : null;

        $allowed_methods = ['GET', 'POST', 'PUT', 'DELETE'];

        if (in_array($method, $allowed_methods)) {
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_CUSTOMREQUEST  => $method,
                CURLOPT_HTTPHEADER  => $headers
            ));

            if ($method != 'GET') {
                curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
            }
    
            return $curl;
        } else {
            return 'fail';
        }
    }

    public function multiCurl($options_array, $callback = []) {
        $master = curl_multi_init();
        
        $request_map = [];

        // start the first batch of requests
        foreach ($options_array as $options) {
            $ch = $this->initCurl($options);
            $key = (string) $ch;
            $request_map[$key] = isset($options['other']) ? $options['other'] : '';  // Other parameter is passed into option
            curl_multi_add_handle($master, $ch);
        }

        do {
            while (($mrc = curl_multi_exec($master, $running)) == CURLM_CALL_MULTI_PERFORM);

            if ($mrc != CURLM_OK) {
                break;
            }

            // a request was just completed -- find out which one
            while ($done = curl_multi_info_read($master)) {
                // get the info and content returned on the request
                $res = array(
                    'output' => curl_multi_getcontent($done['handle']),
                    'info'      => curl_getinfo($done['handle'])
                );

                // send the response values to the callback function.
                if (is_callable($callback)) {
                    $key = (string)$done['handle'];
                    $other_param = $request_map[$key];
                    call_user_func($callback, $res['output'], $other_param);

                    unset($request_map[$key]);
                }
                // remove the curl handle that just completed
                curl_multi_remove_handle($master, $done['handle']);
            }   // End While
            
            // Block for data in / output; error handling is done by curl_multi_exec
            if ($running) {
                curl_multi_select($master, 5);
            }
        } while ($running);

        curl_multi_close($master);
    }
}
