export function EmptyData() {
    const li = document.createElement("li");
    li.classList.add("text-center", "w-full", "px-5");
    li.id = "empty-data";


    const span = document.createElement("span");
    span.innerText = "There is no blocked websites"
    span.classList.add("text-gray-500");
    
    li.append(span);
    return li;
}