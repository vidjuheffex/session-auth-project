var clicksButton = document.querySelector("#clicksButton");
clicksButton.addEventListener("click", function(){
    axios.post("/increment").then(function(response){
        var count = response.data.count;
        clicksButton.textContent = count;
    })
})

console.log("loaded");