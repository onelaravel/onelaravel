@let([$count, $setCount] = useState(0))
@let([$hoverCount, $setHoverCount] = useState(0))
@let([$a, $setA] = useState(0))
@let([$b, $setB] = useState(0))
@let([$c, $setC] = useState(0))

<div>
    <h1>{{ $count }}</h1>
    <button @click($setCount($count + 1))>Increment</button>
    <button @click(setCount($count - 1))>Decrement</button>
    <button @click(test(@event))>Test</button>
    <button @click($count++)>Increment (++)</button>
    <button @click($count--)>Decrement (--)</button>
    <button @click($count += 10)>Increment (+= 10)</button>
    <button @click($count -= 10)>Decrement (-= 10)</button>
    <button @click($count *= 10)>Multiply (*= 10)</button>
    <button @click($count /= 10)>Divide (/= 10)</button>
    <button @click($count %= 10)>Modulo (%= 10)</button>
    <button @click($count **= 10)>Power (**= 10)</button>
    <button @click($count &= 10)>Bitwise AND (&= 10)</button>


    <button @click($a++; $b--, test($a, $b))>test</button>

    <!-- Complex event tests -->
    <button @click($count++; $setCount($count * 2), handleClick(@event, $count, @attr('data-id')), processData($count + 10, @prop('value'))))>Complex Event 1</button>
    
    <button @keyup(validateInput(@event), $setCount($count + 1), submitForm(@event, @val('username'), @value('email'))))>Complex Keyup</button>
    
    <button @mouseover($hoverCount += 5, trackHover(@event, @attr('id'), $hoverCount), updateTooltip(@prop('title'), $hoverCount + 10))>Complex Mouseover</button>
    
    <button @click(handleMultiple($a, $b, $c), $a = $b + $c; $b = $a * 2, processResult($a, $b, $c, @event))>Complex Assignment</button>
    
    <button class="btn btn-primary" @click(nestedCall(outerFunc($count, @event), innerFunc(@attr('type'), @prop('name'))), $setCount(nestedCall($count, $count + 1))))>Nested Functions</button>

</div>
