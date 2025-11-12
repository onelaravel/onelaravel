<?php

namespace Core\Services\BladeCompilers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Str;

class LetConstDirectiveService
{
    public function registerDirectives()
    {
        Blade::directive('let', function ($expression) {
            return $this->processLetConstDirective($expression, 'let');
        });

        Blade::directive('const', function ($expression) {
            return $this->processLetConstDirective($expression, 'const');
        });

        Blade::directive('useState', function ($expression) {
            return $this->processUseStateDirective($expression);
        });


    }

    public function processLetConstDirective($expression, $type)
    {
        $segments = $this->splitExpression($expression);
        $phpCode = [];

        foreach ($segments as $segment) {
            $segment = trim($segment);
            if (empty($segment)) {
                continue;
            }

            // Handle destructuring: `[$var1, $var2] = ...` or `{$var1, $var2} = ...`
            if (preg_match('/^(\[[^\]]+\]|\{[^\}]+\})\s*=\s*(.+)$/s', $segment, $matches)) {
                $leftSide = trim($matches[1]);
                $rightSide = trim($matches[2]);

                // Fix variable names in array destructuring - ensure all variables have $ prefix
                if (Str::startsWith($leftSide, '[') && Str::endsWith($leftSide, ']')) {
                    // Extract variables from array destructuring like [$count, setCount]
                    $leftSide = $this->fixArrayDestructuringVariables($leftSide);
                }

                // Handle object destructuring with (array) cast for PHP
                if (Str::startsWith($leftSide, '{') && Str::endsWith($leftSide, '}')) {
                    $keys = [];
                    preg_match_all('/\$([a-zA-Z_][a-zA-Z0-9_]*)/', $leftSide, $keyMatches);
                    foreach ($keyMatches[1] as $key) {
                        $keys[] = "'{$key}' => \${$key}";
                    }
                    $leftSide = '[' . implode(', ', $keys) . ']';
                    $rightSide = '(array) ' . $rightSide; // Add (array) cast for PHP
                }

                $phpCode[] = "{$leftSide} = {$rightSide};";
            } else {
                // Standard assignment: `$var = value`
                $phpCode[] = "{$segment};";
            }
        }

        return "<?php " . implode(' ', $phpCode) . " ?>";
    }

    public function processUseStateDirective($expression)
    {
        $params = $this->parseParams($expression);

        if (count($params) === 3) {
            list($value, $stateName, $setStateName) = $params;
            
            // Check if stateName and setStateName are variables (start with $)
            if (strpos($stateName, '$') === 0) {
                // Already a variable, use as is
                $stateVar = $stateName;
            } else {
                // Remove quotes and add $ prefix
                $stateVar = '$' . trim($stateName, "'\"");
            }
            
            if (strpos($setStateName, '$') === 0) {
                // Already a variable, use as is
                $setStateVar = $setStateName;
            } else {
                // Remove quotes and add $ prefix
                $setStateVar = '$' . trim($setStateName, "'\"");
            }
            
            return "<?php [{$stateVar}, {$setStateVar}] = useState({$value}); ?>";
        }

        // If parsing fails or parameters are incorrect, return the original directive to prevent hard errors
        return "<?php // Invalid @useState directive: @useState({$expression}) ?>";
    }

    protected function splitExpression($expression)
    {
        $segments = [];
        $balance = 0;
        $currentSegment = '';
        $inString = false;
        $stringChar = '';

        for ($i = 0; $i < strlen($expression); $i++) {
            $char = $expression[$i];

            if ($char === "'" || $char === '"') {
                if ($inString && $char === $stringChar) {
                    $inString = false;
                } elseif (!$inString) {
                    $inString = true;
                    $stringChar = $char;
                }
            }

            if (!$inString) {
                if ($char === '(' || $char === '[' || $char === '{') {
                    $balance++;
                } elseif ($char === ')' || $char === ']' || $char === '}') {
                    $balance--;
                } elseif ($char === ',' && $balance === 0) {
                    $segments[] = $currentSegment;
                    $currentSegment = '';
                    continue;
                }
            }
            $currentSegment .= $char;
        }
        $segments[] = $currentSegment; // Add the last segment
        return array_filter($segments, 'trim');
    }

    protected function parseParams($expression)
    {
        $params = [];
        $balance = 0;
        $currentParam = '';
        $inString = false;
        $stringChar = '';

        for ($i = 0; $i < strlen($expression); $i++) {
            $char = $expression[$i];

            if ($char === "'" || $char === '"') {
                if ($inString && $char === $stringChar) {
                    $inString = false;
                } elseif (!$inString) {
                    $inString = true;
                    $stringChar = $char;
                }
            }

            if (!$inString) {
                if ($char === '(' || $char === '[' || $char === '{') {
                    $balance++;
                } elseif ($char === ')' || $char === ']' || $char === '}') {
                    $balance--;
                } elseif ($char === ',' && $balance === 0) {
                    $params[] = trim($currentParam);
                    $currentParam = '';
                    continue;
                }
            }
            $currentParam .= $char;
        }
        $params[] = trim($currentParam); // Add the last parameter
        return array_filter($params, 'trim');
    }

    /**
     * Fix variable names in array destructuring to ensure all have $ prefix
     * Converts [$count, setCount] to [$count, $setCount]
     */
    protected function fixArrayDestructuringVariables($arrayString)
    {
        // Remove [ and ] brackets
        $content = trim($arrayString, '[]');
        
        // Split by comma, preserving spaces and structure
        $variables = [];
        $parts = explode(',', $content);
        
        foreach ($parts as $part) {
            $part = trim($part);
            
            // If it's a variable that doesn't start with $, add it
            if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $part)) {
                $variables[] = '$' . $part;
            } else {
                // Already has $ or is more complex expression, keep as is
                $variables[] = $part;
            }
        }
        
        return '[' . implode(', ', $variables) . ']';
    }
}
