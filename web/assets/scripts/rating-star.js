class RatingStar {

    static applyOn(container) {
        let addClasses = function(element, classes) {
            for (let clazz of classes) {
                element.classList.add(clazz);
            }
        }

        let average = container.dataset.average;
        let best = container.dataset.best;
        let votes = container.dataset.votes;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let starElements = [];
        for (let index = 0; index < best; index++) {
            starElements.push(document.createElement("span"));
            starElements[index].style.padding = "2px";
        }

        starElements.forEach((element) => addClasses(element, ["fa", "fa-star"]));
        for (let index = 0; index < average; index++) {
            starElements[index].classList.add("checked-star");
        }
        
        addClasses(container, ["row", "center-align"]);
        starElements.forEach((element) => container.appendChild(element));
        container.appendChild(document.createElement("br"));

        let p = document.createElement("p");
        p.style.margin = "0";
        p.appendChild(document.createTextNode("" + average + "/" + best + " (" + votes + ")"));
        container.appendChild(p);
    }

    static applyOnAll() {
        let elements = document.getElementsByClassName("star-container");

        for (let element of elements) {
            RatingStar.applyOn(element);
        }
    }

}
