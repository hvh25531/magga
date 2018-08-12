<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseController extends Controller {
    public $mod;

    public function index(Request $request) {
        if(method_exists($this,'processIndex')) {
            $list = $this->processIndex($request);
        } else {
            $list = $this->mod->orderBy('id', 'DESC')->get();
        }
        $mod = $this->mod->className();
        $view = 'common.list';
        if($request->has('view')) {
            $view = 'common.'.$request->get('view');
        }
        return view($view, compact('list','mod'));
    }

    public function create(Request $request) {
        $var = strtolower($this->mod->className());
        $obj = $this->mod;
        $data=['obj'=>$obj];
        if(method_exists($this,'processCreate')) {
            $data = array_merge($data,$this->processCreate($request,$obj));
        }
        return view($var.'.form',$data);
    }

    public function store(Request $request) {
        if(isset($this->rules)) {
            $this->validate($request,$this->rules);
        }
        $class = get_class($this->mod);
        $obj = new $class($request->all());
        if(method_exists($this,'processStore')) {
            $this->processStore($request,$obj);
        } else {
            $obj->addBy();
            $obj->save();
        }

        $mod=strtolower($this->mod->className());

        $json = [];
        $json['add_elements'] = [];
        $html = view('common.tr',compact('obj','mod'))->render();
        $json['add_elements'][] = array('id'=>'#'.$mod.'_list_tbody','html'=>$html);
        return $json;
    }

    public function edit(Request $request, $id) {
        $var = strtolower($this->mod->className());
        $obj = $this->getObj($id);
        $data=['obj'=>$obj];
        if(method_exists($this,'processEdit')) {
            $data = array_merge($data,$this->processEdit($request,$obj));
        }
        return view($var.'.form', $data);
    }

    private function getObj($id) {
        $class = get_class($this->mod);
        $obj = $class::find($id);
        return $obj;
    }


    public function update(Request $request, $id) {
        $obj = $this->getObj($id);
        if(method_exists($this,'processUpdate')) {
            $this->processUpdate($request,$obj);
        } else {
            if(isset($this->rules)) {
                $this->validate($request,$this->rules);
            }
            $obj->updateBy();
            $obj->update($request->all());
        }

        $mod=strtolower($this->mod->className());

        $json = [];
        $json['update_elements'] = [];
        $html = view($mod.'.td',compact('obj'))->render();
        $json['update_elements'][] = array('id'=>'#tr_'.$mod.'_id_'.$obj->id,'html'=>$html);
        return $json;

    }

    public function destroy(Request $request, $id) {
        $obj = $this->getObj($id);
        $id = $obj->id;
        $obj->deleteBy();
        $obj->delete();

        $mod=strtolower($this->mod->className());

        $json = [];
        $json['delete_ids'] = [];
        $json['delete_ids'][] = '#tr_'.$mod.'_id_'.$id;
        return $json;
    }

    public function show(Request $request, $id) {
        $var = strtolower($this->mod->className());
        $obj = $this->getObj($id);
        return view($var.'.show',compact('obj'));
    }
}
