(function() {
    var inputs = document.querySelectorAll(".rating__input[name='rating']");
    var ratingValue=document.querySelector(".js-star-value");

    Array.prototype.forEach.call(inputs, function(input) {
        input.addEventListener("change", function(){
            ratingValue.value=input.value;
        })
    });
})();