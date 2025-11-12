<?php

namespace Core\Services\BladeCompilers;

use Illuminate\Support\Facades\Blade;

class WrapperDirectiveService
{
    public function registerDirectives(): void {
        // Directive @wrapattr - wrapper directive (legacy)
        Blade::directive('wrapattr', function ($expression) {
            return $this->processWrapDirective($expression);
        });
        Blade::directive('WrapAttr', function ($expression) {
            return $this->processWrapDirective($expression);
        });
        Blade::directive('wrapAttr', function ($expression) {
            return $this->processWrapDirective($expression);
        });
        
        // Directive @wrap - supports all three cases
        Blade::directive('wrap', function ($expression) {
            return $this->startWrapDirective($expression);
        });
        Blade::directive('Wrap', function ($expression) {
            return $this->startWrapDirective($expression);
        });
        Blade::directive('endwrap', function ($expression) {
            return $this->endWrapDirective($expression);
        });
        Blade::directive('EndWrap', function ($expression) {
            return $this->endWrapDirective($expression);
        });
        Blade::directive('endWrap', function ($expression) {
            return $this->endWrapDirective($expression);
        });

        // Directive @wrapper - supports all three cases
        Blade::directive('wrapper', function ($expression) {
            return $this->startWrapDirective($expression);
        });
        Blade::directive('Wrapper', function ($expression) {
            return $this->startWrapDirective($expression);
        });
        Blade::directive('endwrapper', function ($expression) {
            return $this->endWrapDirective($expression);
        });
        Blade::directive('EndWrapper', function ($expression) {
            return $this->endWrapDirective($expression);
        });
        Blade::directive('endwrapper', function ($expression) {
            return $this->endWrapDirective($expression);
        });
    }
    /**
     * Process @wrapattr directive (legacy)
     */
    public function processWrapDirective($expression)
    {
        // Ignore any parameters and generate wrapattr function call
        return '<?php echo $__helper->wrapAttr($__VIEW_PATH__, $__VIEW_ID__);?>';
    }

    /**
     * Process @wrap directive - supports three syntaxes:
     * 1. @wrap -> HTML comment
     * 2. @wrap($tag, $attributes) -> HTML tag with custom tag
     * 3. @wrap($attributes = []) -> HTML div with attributes only
     */
    public function startWrapDirective($expression)
    {
        // Remove outer parentheses if present
        $expression = trim($expression, '()');
        
        if (empty($expression)) {
            // Case 1: @wrap -> HTML comment
            return '<?php echo "<!-- [one:view name=\"$__VIEW_PATH__\" id=\"$__VIEW_ID__\"] -->"; ?>';
        }
        
        // Check if expression starts with array syntax (case 3)
        if (preg_match('/^\s*\[.*\]\s*$/', $expression)) {
            // Case 3: @wrap($attributes = []) -> HTML div with attributes only
            $attributes = $this->parseAttributesArray($expression);
            $attributesStr = $this->formatAttributesForTag($attributes);
            $tag = $attributes['tag'] ?? null;
            
            // Handle subscribe if present
            $subscribeCode = $this->generateSubscribeCode($attributes);
            
            if($tag){
                unset($attributes['tag']);
                return '<?php $__wrapper_tag__ = "'.$tag.'"; '.$subscribeCode.' echo "<'.$tag.' data-wrap-view=\"$__VIEW_PATH__\" data-wrap-id=\"$__VIEW_ID__\"'.$attributesStr.'>"; ?>';
            }
            return '<?php '.$subscribeCode.' echo "<!-- [one:view name=\"$__VIEW_PATH__\" id=\"$__VIEW_ID__\"'.$attributesStr.'] -->"; ?>';
            
        }
        
        // Case 2: @wrap($tag, $attributes) -> HTML tag with custom tag
        $parts = $this->parseWrapExpression($expression);
        $tag = $parts['tag'];
        $attributes = $parts['attributes'];
        
        // Generate opening tag with attributes
        $attributesStr = $this->formatAttributesForTag($attributes);
        
        // Handle subscribe if present
        $subscribeCode = $this->generateSubscribeCode($attributes);
        
        return '<?php $__wrapper_tag__ = "'.$tag.'"; '.$subscribeCode.' echo "<'.$tag.' data-wrap data-wrap-view=\"$__VIEW_PATH__\" data-wrap-id=\"$__VIEW_ID__\"'.$attributesStr.'>"; ?>';
    }

    /**
     * Process @endWrap directive - always no parameters
     * Uses $__wrapper_tag__ variable to determine closing tag
     */
    public function endWrapDirective($expression)
    {
        // @endWrap should always be without parameters
        // Check if $__wrapper_tag__ is set to determine closing method
        return '<?php if (isset($__wrapper_tag__) && $__wrapper_tag__) { echo "</{$__wrapper_tag__}>"; unset($__wrapper_tag__); } else { echo "<!-- [/one:view] -->"; } ?>';
    }

    /**
     * Parse @wrap expression to extract tag and attributes
     */
    private function parseWrapExpression($expression)
    {
        // Find first comma outside quotes
        $inQuote = false;
        $quoteChar = null;
        $commaPos = false;
        
        for ($i = 0; $i < strlen($expression); $i++) {
            $char = $expression[$i];
            
            if (($char === '"' || $char === "'") && ($i === 0 || $expression[$i-1] !== '\\')) {
                if (!$inQuote) {
                    $inQuote = true;
                    $quoteChar = $char;
                } elseif ($char === $quoteChar) {
                    $inQuote = false;
                    $quoteChar = null;
                }
            }
            
            if (!$inQuote && $char === ',') {
                $commaPos = $i;
                break;
            }
        }
        
        if ($commaPos === false) {
            // Only tag, no attributes
            $tag = trim($expression, '\'" ');
            return ['tag' => $tag, 'attributes' => []];
        }
        
        // Both tag and attributes
        $tagPart = substr($expression, 0, $commaPos);
        $attributesPart = substr($expression, $commaPos + 1);
        
        $tag = trim($tagPart, '\'" ');
        $attributes = $this->parseAttributesArray($attributesPart);
        
        return ['tag' => $tag, 'attributes' => $attributes];
    }
    
    /**
     * Parse attributes array from string
     */
    private function parseAttributesArray($attributesStr)
    {
        $attributesStr = trim($attributesStr);
        
        // Remove brackets
        $attributesStr = trim($attributesStr, '[]');
        
        if (empty($attributesStr)) {
            return [];
        }
        
        // Parse key-value pairs with support for nested arrays
        $attributes = [];
        $current = '';
        $inQuote = false;
        $quoteChar = null;
        $key = '';
        $value = '';
        $expectingValue = false;
        $bracketDepth = 0;
        
        for ($i = 0; $i < strlen($attributesStr); $i++) {
            $char = $attributesStr[$i];
            
            if (($char === '"' || $char === "'") && ($i === 0 || $attributesStr[$i-1] !== '\\')) {
                if (!$inQuote) {
                    $inQuote = true;
                    $quoteChar = $char;
                } elseif ($char === $quoteChar) {
                    $inQuote = false;
                    $quoteChar = null;
                }
                $current .= $char;
            } elseif (!$inQuote && $char === '[') {
                $bracketDepth++;
                $current .= $char;
            } elseif (!$inQuote && $char === ']') {
                $bracketDepth--;
                $current .= $char;
            } elseif (!$inQuote && $char === '=' && $i + 1 < strlen($attributesStr) && $attributesStr[$i + 1] === '>') {
                // Found =>, this is key
                $key = trim($current, '\'" ');
                $current = '';
                $expectingValue = true;
                $i++; // Skip >
            } elseif (!$inQuote && $char === ',' && $expectingValue && $bracketDepth === 0) {
                // End value (only if not inside brackets)
                $value = trim($current, '\'" ');
                $attributes[$key] = $value;
                $key = '';
                $value = '';
                $current = '';
                $expectingValue = false;
            } else {
                $current .= $char;
            }
        }
        
        // Handle last attribute
        if ($expectingValue && !empty($current)) {
            $value = trim($current, '\'" ');
            $attributes[$key] = $value;
        }
        
        // If no attributes were parsed, try to parse the whole string as a single attribute
        if (empty($attributes) && !empty($attributesStr)) {
            // Check if it's a single key-value pair
            if (preg_match('/^\s*(\w+)\s*=>\s*(.*?)\s*$/', $attributesStr, $matches)) {
                $key = $matches[1];
                $value = trim($matches[2], '\'" ');
                $attributes[$key] = $value;
            }
        }
        
        // Fix array parsing issue - if value contains unclosed brackets, fix it
        foreach ($attributes as $key => $value) {
            if (is_string($value) && strpos($value, '[') !== false && strpos($value, ']') === false) {
                // Add missing closing bracket
                $attributes[$key] = $value . ']';
            }
        }
        
        // Process special 'follow' parameter
        if (isset($attributes['follow'])) {
            $attributes['follow'] = $this->processFollowParameter($attributes['follow']);
        }
        // Process special 'subscribe' parameter (same style as follow)
        if (isset($attributes['subscribe'])) {
            $attributes['subscribe'] = $this->processSubscribeParameter($attributes['subscribe']);
        }
        
        return $attributes;
    }
    
    /**
     * Process special 'follow' parameter
     * Handles:
     * - ['follow' => false] -> keep as false
     * - ['follow' => $stateKey] -> convert to ["stateKey"]
     * - ['follow' => [$stateKey1, $stateKey2, ...]] -> convert to ["stateKey1", "stateKey2", ...]
     */
    private function processFollowParameter($followValue)
    {
        // If false, keep as is
        if ($followValue === 'false' || $followValue === false) {
            return 'false';
        }
        
        // If it's a single variable (starts with $)
        if (preg_match('/^\s*\$(\w+)\s*$/', $followValue, $matches)) {
            $varName = $matches[1];
            return $varName;
        }
        
        // If it's an array of variables
        if (preg_match('/^\s*\[(.*?)\]\s*$/', $followValue, $matches)) {
            $arrayContent = $matches[1];
            
            // Split by comma and process each variable
            $variables = array_map('trim', explode(',', $arrayContent));
            $processedVars = [];
            
            foreach ($variables as $var) {
                if (preg_match('/^\s*\$(\w+)\s*$/', $var, $varMatches)) {
                    $processedVars[] = $varMatches[1];
                } else {
                    // Keep as is if not a variable
                    $processedVars[] = trim($var, '\'" ');
                }
            }
            
            return implode(',', $processedVars);
        }
        
        // If it's a single variable without $ (already processed)
        if (preg_match('/^\s*(\w+)\s*$/', $followValue, $matches)) {
            return $matches[1];
        }
        
        // Return as is for other cases
        return $followValue;
    }

    /**
     * Process special 'subscribe' parameter
     * Supports:
     * - ['subscribe' => false|true]
     * - ['subscribe' => $stateKey]
     * - ['subscribe' => [$stateKey1, $stateKey2, ...]]
     */
    private function processSubscribeParameter($subscribeValue)
    {
        // Booleans as string to keep attribute formatting consistent
        if ($subscribeValue === 'false' || $subscribeValue === false) {
            return 'false';
        }
        if ($subscribeValue === 'true' || $subscribeValue === true) {
            return 'true';
        }
        // Single variable with $ prefix
        if (preg_match('/^\s*\$(\w+)\s*$/', $subscribeValue, $matches)) {
            return $matches[1];
        }
        // Array of variables
        if (preg_match('/^\s*\[(.*?)\]\s*$/', $subscribeValue, $matches)) {
            $arrayContent = $matches[1];
            $variables = array_map('trim', explode(',', $arrayContent));
            $processed = [];
            foreach ($variables as $var) {
                if (preg_match('/^\s*\$(\w+)\s*$/', $var, $varMatches)) {
                    $processed[] = $varMatches[1];
                } else {
                    $processed[] = trim($var, '\'" ');
                }
            }
            return implode(',', $processed);
        }
        // Single token without $ (already processed)
        if (preg_match('/^\s*(\w+)\s*$/', $subscribeValue, $matches)) {
            return $matches[1];
        }
        return $subscribeValue;
    }

    /**
     * Generate subscribeState call code from attributes
     */
    private function generateSubscribeCode($attributes)
    {
        if (!isset($attributes['subscribe'])) {
            return '';
        }
        
        $subscribeValue = $attributes['subscribe'];
        
        // Handle boolean values
        if ($subscribeValue === 'false' || $subscribeValue === false) {
            return '$__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, false); ';
        }
        if ($subscribeValue === 'true' || $subscribeValue === true) {
            return '$__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, true); ';
        }
        
        // Handle single key or comma-separated keys
        if (is_string($subscribeValue) && strpos($subscribeValue, ',') !== false) {
            // Multiple keys: "key1,key2,key3"
            $keys = array_map('trim', explode(',', $subscribeValue));
            $keysJson = json_encode($keys);
            return '$__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, '.$keysJson.'); ';
        } else {
            // Single key
            $key = is_string($subscribeValue) ? $subscribeValue : (string)$subscribeValue;
            $keysJson = json_encode([$key]);
            return '$__helper->subscribeState($__VIEW_PATH__, $__VIEW_ID__, '.$keysJson.'); ';
        }
    }
    
    /**
     * Format attributes for HTML tag
     */
    private function formatAttributesForTag($attributes)
    {
        if (empty($attributes)) {
            return '';
        }
        
        $attrStrings = [];
        foreach ($attributes as $key => $value) {
            $attrStrings[] = " {$key}=\\\"{$value}\\\"";
        }
        
        return implode('', $attrStrings);
    }
}
