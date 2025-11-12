<?php [$count, $setCount] = useState(0); ?>
<?php [$hoverCount, $setHoverCount] = useState(0); ?>
<?php [$a, $setA] = useState(0); ?>
<?php [$b, $setB] = useState(0); ?>
<?php [$c, $setC] = useState(0); ?>

<div>
    <h1><?php echo e($count); ?></h1>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => setCount($count + 1)']); ?>>Increment</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'setCount', 'params' => [$count - 1]]]); ?>>Decrement</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'test', 'params' => ["@EVENT"]]]); ?>>Test</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count++']); ?>>Increment (++)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count--']); ?>>Decrement (--)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count += 10']); ?>>Increment (+= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count -= 10']); ?>>Decrement (-= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count *= 10']); ?>>Multiply (*= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count /= 10']); ?>>Divide (/= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count %= 10']); ?>>Modulo (%= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count **= 10']); ?>>Power (**= 10)</button>
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count &= 10']); ?>>Bitwise AND (&= 10)</button>


    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => a++', '(event) => b--', ['handler' => 'test', 'params' => [$a, $b]]]); ?>>test</button>

    <!-- Complex event tests -->
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', ['(event) => count++', '(event) => setCount($count * 2)', ['handler' => 'handleClick', 'params' => ["@EVENT", $count, "#ATTR:data-id"]], ['handler' => 'processData', 'params' => [$count + 10, "#PROP:value"]]]); ?>)>Complex Event 1</button>
    
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'keyup', [['handler' => 'validateInput', 'params' => ["@EVENT"]], '(event) => setCount($count + 1)', ['handler' => 'submitForm', 'params' => ["@EVENT", "#VALUE:username", "#VALUE:email"]]]); ?>)>Complex Keyup</button>
    
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'mouseover', ['(event) => hoverCount += 5', ['handler' => 'trackHover', 'params' => ["@EVENT", "#ATTR:id", $hoverCount]], ['handler' => 'updateTooltip', 'params' => ["#PROP:title", $hoverCount + 10]]]); ?>>Complex Mouseover</button>
    
    <button <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'handleMultiple', 'params' => [$a, $b, $c]], '(event) => a = b + c', '(event) => b = a * 2', ['handler' => 'processResult', 'params' => [$a, $b, $c, "@EVENT"]]]); ?>>Complex Assignment</button>
    
    <button class="btn btn-primary" <?php echo $__helper->addEventListener($__VIEW_PATH__, $__VIEW_ID__,'click', [['handler' => 'nestedCall', 'params' => [['handler' => 'outerFunc', 'params' => [$count, "@EVENT"]], ['handler' => 'innerFunc', 'params' => ["#ATTR:type", "#PROP:name"]]]], ['handler' => 'setCount', 'params' => [['handler' => 'nestedCall', 'params' => [$count, $count + 1]]]]]); ?>)>Nested Functions</button>

</div>
<?php /**PATH /Users/doanln/Desktop/2025/Projects/steakapp/resources/views/components/tset.blade.php ENDPATH**/ ?>