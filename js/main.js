document.querySelector('section').addEventListener('click', function(evt){
    console.log(evt.target);
    evt.target.className = 'highlight';
});