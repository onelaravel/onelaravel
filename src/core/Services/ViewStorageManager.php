<?php

namespace Core\Services;

class ViewStorageManager
{
    protected $wrapperLevel = -1;
    protected $wrapperStack = [];
    protected $viewScripts = [];
    protected $viewResources = [];
    protected $viewStyles = [];
    protected $vueComponents = [];
    protected $registeredResources = [];
    protected $viewStorage = [];
    protected $eventRegistry = [];
    public function __construct()
    {
    }

    public function reset(){
        $this->wrapperLevel = -1;
        $this->wrapperStack = [];
        $this->viewScripts = [];
        $this->viewResources = [];
        $this->viewStyles = [];
        $this->vueComponents = [];
        $this->registeredResources = [];
        $this->viewStorage = [];
        $this->eventRegistry = [];
    }

    public function registerView($viewName, $viewId){
        if(!isset($this->viewStorage[$viewName])){
            $this->viewStorage[$viewName] = [
                'scripts' => [],
                'styles' => [],
                'resources' => [],
                'instances' => [],
            ];
        }

        if(!isset($this->viewStorage[$viewName]['instances'][$viewId])){
            $this->viewStorage[$viewName]['instances'][$viewId] = [
                'viewId' => $viewId,
                'data' => [],
                'events' => [],
            ];
        }
    }



    public function addViewData($viewName, $viewId, $data){
        $this->registerView($viewName, $viewId);
        if(!isset($this->viewStorage[$viewName]['instances'][$viewId])){
            return;
        }
        $this->viewStorage[$viewName]['instances'][$viewId]['data'] = $data;
    }

    public function getViewData($viewName, $viewId){
        $this->registerView($viewName, $viewId);
        return $this->viewStorage[$viewName]['instances'][$viewId]['data'];
    }

    public function setParentView($viewName, $viewId, $parentViewName, $parentViewId){
        $this->registerView($viewName, $viewId);
        $this->viewStorage[$viewName]['instances'][$viewId]['parent'] = [
            'name' => $parentViewName,
            'id' => $parentViewId
        ];
    }

    public function setOriginView($viewName, $viewId, $originViewName, $originViewId){
        $this->registerView($viewName, $viewId);
        $this->viewStorage[$viewName]['instances'][$viewId]['origin'] = [
            'name' => $originViewName,
            'id' => $originViewId
        ];
    }
    public function setSuperView($viewName, $viewId, $superViewName, $superViewId){
        $this->registerView($viewName, $viewId);
        $this->viewStorage[$viewName]['instances'][$viewId]['super'] = [
            'name' => $superViewName,
            'id' => $superViewId
        ];
    }

    public function addChildrenView($viewName, $viewId, $childrenViewName, $childrenViewId){
        $this->registerView($viewName, $viewId);
        if(!isset($this->viewStorage[$viewName]['instances'][$viewId]['children'])){
            $this->viewStorage[$viewName]['instances'][$viewId]['children'] = [];
        }
        $this->viewStorage[$viewName]['instances'][$viewId]['children'][] = [
            'name' => $childrenViewName,
            'id' => $childrenViewId
        ];
    }

    public function exportViewData(){
        $exportData = [];
        foreach($this->viewStorage as $viewName => $view){
            foreach($view['instances'] as $viewId => $viewData){
                $data = $viewData['data'];
                $exportData[] = [
                    'tag' => 'script',
                    'attributes' => [
                        'type' => 'application/json',
                        'data-view-id' => $viewId,
                        'data-view-name' => $viewName,
                        'data-ref' => 'view-data'
                    ],
                    'content' => json_encode($data)
                ];
            }
        }
        return $exportData;
    }

    public function exportApplicationData(){
        $exportData = array_map(function($view){
            return $this->deepArrayConvert($view);
        }, $this->viewStorage);
        return $exportData;
        
    }

    /**
     * Deep convert tất cả objects/collections sang array
     * Nếu object có method toArray() thì gọi nó
     */
    protected function deepArrayConvert($data)
    {
        if (is_array($data)) {
            // Nếu là array, recursively convert từng element
            return array_map([$this, 'deepArrayConvert'], $data);
        } elseif (is_object($data)) {
            // Nếu object có method toArray(), gọi nó
            if (method_exists($data, 'toArray')) {
                return $this->deepArrayConvert($data->toArray());
            }
            // Nếu không có toArray(), convert properties sang array
            elseif ($data instanceof \stdClass) {
                return $this->deepArrayConvert((array) $data);
            }
            // Với các object khác, convert sang array và recursively process
            else {
                $array = [];
                foreach (get_object_vars($data) as $key => $value) {
                    $array[$key] = $this->deepArrayConvert($value);
                }
                return $array;
            }
        } else {
            // Primitive types (string, int, bool, null) - return as is
            return $data;
        }
    }

    public function addInitCode($viewName, $viewId, $code){
        $this->registerView($viewName, $viewId);
        preg_match('/<script[^>]*>(.*?)<\/script>/s', $code, $matches);
        $script = $matches[1];
        if($script){

            $this->viewStorage[$viewName]['scripts']['init'] = $script;
        }
        preg_match('/<style[^>]*>(.*?)<\/style>/s', $code, $matches);
        $style = $matches[1];
        if($style){
            $this->viewStorage[$viewName]['styles']['init'] = $style;
        }
    }

    public function startWrapper($tags, $attributes = [], $viewId = null){
        $this->wrapperLevel++;
        if(is_array($tags)){
            $tags = $tags['tag'];
            unset($tags['tag']);
            $attributes = $tags;
        }
        elseif(is_string($tags)){
            $tags = $tags;
        }
        else{
            $tags = 'div';
        }
        if(!is_array($attributes)){
            $attributes = [];
        }
        $attributes['data-view-wrapper'] = $viewId;
        $this->wrapperStack[$this->wrapperLevel] = [
            'tag' => $tags,
            'attributes' => $attributes,
            'viewId' => $viewId
        ];

        echo '<'.$tags.' '.implode(' ', array_map(function($key, $value){
            return $key.'="'.$value.'"';
        }, array_keys($attributes), $attributes)).'>';
    }

    public function endWrapper($viewId = null){
        if($this->wrapperLevel < 0){
            return;
        }
        echo '</'.$this->wrapperStack[$this->wrapperLevel]['tag'].'>';
        $this->wrapperLevel--;
    }

    public function startWrapperAttr($viewId = null){
        echo ' data-view-wrapper="'.$viewId.'"';
    }

    public function addScript($viewName, $viewId, $scripts){
        $this->registerView($viewName, $viewId);
        $this->viewStorage[$viewName][$viewId]['scripts'] = $scripts;
    }
    public function addStyle($viewName, $viewId, $styles){
        $this->registerView($viewName, $viewId);
        $this->viewStorage[$viewName][$viewId]['styles'] = $styles;
    }

    public function addEventListener($viewPath = null, $viewId = null, $eventType = null, $handlers = []){
        if($viewPath){
            $this->registerView($viewPath, $viewId);
        }
        // $eventID = uniqid();
        if(!isset($this->viewStorage[$viewPath]['instances'][$viewId]['events'])){
            $this->viewStorage[$viewPath]['instances'][$viewId]['events'] = [];
        }
        $eventIndex = count($this->viewStorage[$viewPath]['instances'][$viewId]['events']);
        $eventID = $viewId.'-'.$eventType.'-'.$eventIndex;
        $this->viewStorage[$viewPath]['instances'][$viewId]['events'][] = [
            'id' => $eventID,
            'type' => $eventType,
            'handlers' => $handlers
        ];
        return " data-{$eventType}-id=\"{$eventID}\"";
    }

    public function addEventQuickHandle($viewPath = null, $viewId = null, $eventType = null, $quickHandlers = []){
        if($viewPath){
            $this->registerView($viewPath, $viewId);
        }
        $eventID = uniqid();
        if(!isset($this->viewStorage[$viewPath]['instances'][$viewId]['quickHandles'][$eventType])){
            $this->viewStorage[$viewPath]['instances'][$viewId]['quickHandles'][$eventType] = [];
        }
        $this->viewStorage[$viewPath]['instances'][$viewId]['quickHandles'][$eventType][$eventID] = $quickHandlers;
        return " data-{$eventType}-quick-id=\"{$eventID}\"";
    }

    public function subscribeState($viewPath = null, $viewId = null, $subscribe = true){
        if($viewPath){
            $this->registerView($viewPath, $viewId);
        }
        $this->viewStorage[$viewPath]['instances'][$viewId]['subscribe'] = $subscribe;
    }

    public function addFollowingBlock($viewPath, $viewId, $followTaskId, $stateKeys){
        $this->registerView($viewPath, $viewId);
        if(!isset($this->viewStorage[$viewPath]['instances'][$viewId]['following'])){
            $this->viewStorage[$viewPath]['instances'][$viewId]['following'] = [];
        }
        $followingBlockIndex = count($this->viewStorage[$viewPath]['instances'][$viewId]['following']);
        $this->viewStorage[$viewPath]['instances'][$viewId]['following'][$followingBlockIndex] = [
            'id' => $followTaskId,
            'stateKeys' => explode(',', $stateKeys)
        ];
        return $followingBlockIndex;
    }
}