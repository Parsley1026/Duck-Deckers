//THIS FILE HANDLES MOVING CARDS AND SUCH
const position = { x: 0, y: 0 }
interact('.draggable').draggable({
    listeners: {
        start (event) {
            console.log(event.type, event.target)
        },
        move (event) {
            position.x += event.dx
            position.y += event.dy

            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
        },
    }
})
interact('.rectangle')
    .dropzone({
        ondrop: function (event) { //when dropped into


        }
    })
    .on('dropactivate', function (event) {
        event.target.classList.add('drop-activated')
    })

// Enable draggability for the rectangle
interact('.draggable')
    .draggable({
        modifiers: [
            interact.modifiers.snap({
                targets: [
                    interact.createSnapGrid({ x: 10, y: 10 })
                ],
                range: Infinity,
                relativePoints: [{ x: 0, y: 0 }]
            }),
            interact.modifiers.restrictRect({
                restriction: 'parent'
            })
        ],
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener,
    });

// Enable dropzone functionality
interact('.rectangle')
    .dropzone({
        overlap: 0.5,
        ondropactivate: function (event) {
            event.target.classList.add('drop-activated');
        },
        ondropdeactivate: function (event) {
            event.target.classList.remove('drop-activated');
        }
    });

function dragMoveListener(event) {
    let target = event.target;

    target.style.transform = `translate(${event.dx}px, ${event.dy}px)`;

    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
