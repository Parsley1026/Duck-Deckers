// THIS CODE IS DEFUNCT AND NOT CONNECTED TO ANYTHING. THAT SAID, I DON'T WANT TO DELETE IT JUST IN CASE.

const position = { x: 0, y: 0 };
let lockedIn = true;
let debug = document.getElementById('debugger');



// Enable draggability for elements with the 'draggable' class
interact('.draggable').draggable({
    listeners: {
        start (event) {
            console.log(event.type, event.target);
        },
        move (event) {
            if(!lockedIn) {
                // Update the position of the dragged element


                position.x += event.dx;
                position.y += event.dy;


                // Apply the translation to the dragged element

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`;
                //check if the draggable element is touching the rectangle
                checkOverlap(event.target, document.querySelector('.rectangle'));
            }




        },
    }
});




// Enable draggability with specific modifiers for elements with the 'draggable' class
interact('.draggable')
    .draggable({
        modifiers: [
            // Snap to a grid with 10x10 spacing
            interact.modifiers.snap({
                targets: [
                    interact.createSnapGrid({ x: 10, y: 10 })
                ],
                range: Infinity,
                relativePoints: [{ x: 0, y: 0 }]
            }),
            // Restrict dragging within the parent element
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: false,
                elementRect: { top: 0.5, left: 0, bottom: -1, right: 1 }
            })
        ],
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener,
    });


// Enable dropzone functionality for elements with the 'rectangle' class
interact('.rectangle')
    .dropzone({
        overlap: 0.5,
        ondrop: function (event) {

            // Code to execute when an element is dropped into this dropzone
        },
        ondropactivate: function (event) {
            // Add a class to the dropzone when it is activated
            event.target.classList.add('drop-activated');
            lockedIn = true;
        },
        ondropdeactivate: function (event) {
            // Remove the class from the dropzone when a draggable is dragged away from it
            event.target.classList.remove('drop-activated');
        }
    });
// Function to handle the drag movement of elements
function dragMoveListener(event) {
    if(lockedIn) { //disable moving if it's locked into a zone.
        let target = event.target;

        // Apply the translation to the dragged element
        target.style.transform = `translate(${event.dx}px, ${event.dy}px)`;

        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // Apply the translation to the dragged element
        target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

        // Update the data attributes with the new position
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
}
function checkOverlap(draggable, rectangle) {
    const draggableRect = draggable.getBoundingClientRect();
    const rectangleRect = rectangle.getBoundingClientRect();

    if (
        draggableRect.right >= rectangleRect.left &&
        draggableRect.left <= rectangleRect.right &&
        draggableRect.bottom >= rectangleRect.top &&
        draggableRect.top <= rectangleRect.bottom
    ) {
        lockedIn = true;
        alert("AHHH");
    }
}
