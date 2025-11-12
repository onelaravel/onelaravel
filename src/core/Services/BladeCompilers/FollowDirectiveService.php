<?php

namespace Core\Services\BladeCompilers;

use Illuminate\Support\Facades\Blade;

class FollowDirectiveService
{
    public function registerDirectives(): void
    {
        // Directive @follow/@watch - open follow (@watch is an alias for @follow)
        Blade::directive('follow', function ($expression) {
            return $this->openFollow($expression);
        });
        Blade::directive('Follow', function ($expression) {
            return $this->openFollow($expression);
        });
        Blade::directive('watch', function ($expression) {
            return $this->openFollow($expression);
        });
        Blade::directive('Watch', function ($expression) {
            return $this->openFollow($expression);
        });

        // Directive @endFollow/@endWatch - close follow
        Blade::directive('endFollow', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('EndFollow', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('endfollow', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('Endfollow', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('endWatch', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('EndWatch', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('endwatch', function ($expression) {
            return $this->closeFollow($expression);
        });
        Blade::directive('Endwatch', function ($expression) {
            return $this->closeFollow($expression);
        });
    }

    /**
     * Process @follow directive - state following
     * Supports:
     * - @follow($stateKey)
     * - @follow($stateKey, $stateKey2, ...)
     * - @follow([$stateKey, $stateKey2, ...])
     */
    public function openFollow($expression)
    {
        if (empty($expression)) {
            return '';
        }

        $content = trim($expression);;
        // Case 1: Single parameter - @follow($stateKey)
        if (preg_match('/^\$?(\w+)$/', $content, $matches)) {
            $stateKey = $matches[1];
            return $this->generateOpeningFollowMarkup($stateKey);
        }
        
        // Case 2: Multiple parameters - @follow($stateKey, $stateKey2, ...)
        if (strpos($content, ',') !== false && strpos($content, '[') !== 0) {
            $stateKeys = $this->parseMultipleStateKeys($content);
            $stateKeysStr = implode(',', $stateKeys);
            return $this->generateOpeningFollowMarkup($stateKeysStr);
        }
        
        // Case 3: Array parameter - @follow([$stateKey, $stateKey2, ...])
        if (strpos($content, '[') === 0 && strpos($content, ']') === strlen($content) - 1) {
            $arrayContent = trim($content, '[]');
            $stateKeys = $this->parseStateArray($arrayContent);
            $stateKeysStr = implode(',', $stateKeys);
            return $this->generateOpeningFollowMarkup($stateKeysStr);
        }

        return '';
    }
    public function generateOpeningFollowMarkup($stateKeys){
        return '<?php $__FOLLOW_TASK_ID__ = uniqid(); $__CURRENT_FOLLOW_INDEX__ = $__helper->addFollowingBlock($__VIEW_PATH__, $__VIEW_ID__, $__FOLLOW_TASK_ID__, "'.$stateKeys.'"); ?>'
             . '<!-- [one:follow type="state" following="'.$stateKeys.'" id="<?php echo $__FOLLOW_TASK_ID__; ?>"] -->';
    }

    /**
     * Process @endFollow directive - close follow
     */
    public function closeFollow($expression)
    {
        return "<!-- [/one:follow] -->";
    }

    /**
     * Parse multiple state keys from comma-separated string
     */
    protected function parseMultipleStateKeys($content)
    {
        $stateKeys = [];
        $items = explode(',', $content);
        
        foreach ($items as $item) {
            $item = trim($item);
            // Remove $ prefix from state variable
            if (strpos($item, '$') === 0) {
                $stateKey = substr($item, 1);
            } else {
                $stateKey = $item;
            }
            if (!empty($stateKey)) {
                $stateKeys[] = $stateKey;
            }
        }
        
        return $stateKeys;
    }

    /**
     * Parse state array content and extract state keys
     */
    protected function parseStateArray($arrayContent)
    {
        $stateKeys = [];
        $items = [];
        $current = '';
        $inQuotes = false;
        $quoteChar = '';
        $parenCount = 0;
        
        for ($i = 0; $i < strlen($arrayContent); $i++) {
            $char = $arrayContent[$i];
            
            if (($char === '"' || $char === "'") && !$inQuotes) {
                $inQuotes = true;
                $quoteChar = $char;
                $current .= $char;
            } elseif ($char === $quoteChar && $inQuotes) {
                $inQuotes = false;
                $quoteChar = '';
                $current .= $char;
            } elseif ($char === '[' && !$inQuotes) {
                $parenCount++;
                $current .= $char;
            } elseif ($char === ']' && !$inQuotes) {
                $parenCount--;
                $current .= $char;
            } elseif ($char === ',' && !$inQuotes && $parenCount === 0) {
                if (trim($current)) {
                    $items[] = trim($current);
                }
                $current = '';
            } else {
                $current .= $char;
            }
        }
        
        if (trim($current)) {
            $items[] = trim($current);
        }
        
        // Process each item
        foreach ($items as $item) {
            $item = trim($item);
            // Remove $ prefix from state variable
            if (strpos($item, '$') === 0) {
                $stateKey = substr($item, 1);
            } else {
                $stateKey = $item;
            }
            if (!empty($stateKey)) {
                $stateKeys[] = $stateKey;
            }
        }
        
        return $stateKeys;
    }
}
