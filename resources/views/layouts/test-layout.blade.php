@fetch(['method' => 'post', 'url' => url('/api/checkauth'), 'data' => ['test' => 'haha'], 'headers' => ['api-key' => '123456']])
@vars($data = ['name' => 'Layout Test'], $todos = ['Task 1', 'Task 2', 'Task 3'])
@const([$toduList, $setTodoList] = useState($todos), [$newTodo, $setNewTodo] = useState(''))

<div class="layout">
    <p>Layout View ID: {{ $__VIEW_ID__ }}</p>
    @yield('content')
</div>
<div class="test-directives">
    <h3>Todo List:</h3>
    @if (count($toduList) > 0)
        <ul>
            @foreach ($toduList as $todo)
                <li>
                    <a href="javascript:void(0)" @click(addTodo())>{{ $todo }}</a>
                    <button class="btn showdata" @click(alert($a->b + $c . $d . 'test'))>i</button>
                    <button class="btn" @click(removeTodo($loop->index))>x</button>

                </li>
            @endforeach
        </ul>
    @else
        <p>No todos available.</p>
    @endif
    <div class="spacer"></div>
    <input type="text" @model($newTodo) name="newTodo" placeholder="Enter new todo" />
    <button @click(addTodo())>Add Todo</button>
</div>
@register
    <script setup>
        export default {
            addTodo() {
                if (newTodo.trim() !== '') {
                    setTodoList([...toduList, newTodo.trim()]);
                    setNewTodo('');
                }
            },
            removeTodo(index) {
                const updatedTodos = toduList.filter((_, i) => i !== index);
                setTodoList(updatedTodos);
            }
        }
    </script>
@endregister
