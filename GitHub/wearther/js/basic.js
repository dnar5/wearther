// Get jquery objects from DOM
var pageheader = $("#page-header")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var pagecontainer = $("#page-container")[0]; 
var imgSelector = $("#my-file-selector"); //You dont have to use [0], however this just means whenever you use the object you need to refer to it with [0].
var refreshbtn = $("#refreshbtn"); 
//Note: changing them all to [0] may prevent some errors when using functions linked to that variable.

// Register event listeners
imgSelector.on("change", function () {
    pageheader.innerHTML = "Just a sec while we analyse your mood..."; //good to let your user know something is happening!
    processImage(function (file) { //this checks the extension and file
        // Get emotions based on image
        sendEmotionRequest(file, function (emotionScores) { //here we send the API request and get the response
            // Find out most dominant emotion
            currentMood = getCurrMood(emotionScores);  //this is where we send out scores to find out the predominant emotion
            changeUI(); //time to update the web app, with their emotion!

            //Done!!
        });
    });
});
refreshbtn.on("click", function () {
    // Load random song based on mood
    alert("You clicked the button"); //can demo with sweetAlert plugin
});

function processImage(callback) {
     var reader = new FileReader();
     var formData = new FormData(document.querySelector('form'));
    if (formData) {
        reader.readAsDataURL(formData); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");}
    reader.onloadend = function () {
            callback(formData);}
    };

var Outfit = (function () {       //Creating a Mood object which has the mood as a string and its corresponding emoji
    function Outfit(outfit) {
        this.outfit = outift;
        this.name = outfit;
    }
    return Mood;
}());

var cold = new Outfit("bring a jumper");
var raining = new Outfit("dont forget an umbrella");
var sunny = new Outfit("sunhat/sunnies");

function getCurrWeather(scores) {
    var currentWeather;
    // In a practical sense, you would find the max emotion out of all the emotions provided. However we'll do the below just for simplicity's sake :P
    if (scores.cold > 0.4) {
        currentWeather = cold;
    }
    else if (scores.raining > 0.4) {
        currentWeather = raining;
    }
    else if (scores.sunny > 0.4) {
        currentWeather = sunny;
    
    }
    return currentWeather;
}
// Manipulate the DOM
function changeUI() {
    //Show detected mood
    pageheader.innerHTML = "You should wear: " + currentWeather.name;  //Remember currentMood is a Mood object, which has a name and emoji linked to it. 
   

}
function sendEmotionRequest(file, callback) {
    $.ajax({
        url: "http://api.apixu.com/v1/current.json?",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "06dd943e96fd42bb95a02203160709");
        },
        type: "POST",
        data: form,
        processData: false
    })
        .done(function (data) {
            if (data.length != 0) { // if a face is detected
                // Get the emotion scores
                var scores = data[0].scores;
                callback(scores);
            } else {
                pageheader.innerHTML = "Hmm, we can't detect a location. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}
