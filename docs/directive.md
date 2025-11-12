ví dụ:
@if($id > 1)
            <li>{{ $id }} {{ $user->name }} {{ $abc }}</li>
        @elseif ($i == 5)
            <li>{{ $id }} {{ $user->name }} {{ $abc }}</li>
        @else
            <li>{{ $id }} {{ $user->name }} {{ $abc }}</li>
        @endif


Kết quả:
${SPA.View.excute() => {
    if(id > 1){
        return `
            <li>${SPA.View.escString(id)} ${SPA.View.escString(user.name)} ${SPA.View.escString(abc)}</li>
        `
    }
    else if(id == 5){
        return `
            <li>${SPA.View.escString(id)} ${SPA.View.escString(user.name)} ${SPA.View.escString(abc)}</li>
        `
    }else{
        return `
            <li>${SPA.View.escString(id)} ${SPA.View.escString(user.name)} ${SPA.View.escString(abc)}</li>
        `
    }
}}