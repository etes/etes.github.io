$('.hover-block').hover(
  function() {
    explodeLetter($(this).parents('section').attr('id'), $(this).data('letter'), $(this).data('color'));
  }, function() {
    implodeLetter($(this).parents('section').attr('id'), $(this).data('letter'), $(this).data('color'));
  }
);
introStuff();

function explodeLetter(parentID, letter, fillColor) {
    $('#'+parentID+' .word-digital .letter.'+letter).find('rect').each(function() {
        $(this).css({
            'fill': fillColor,
            '-webkit-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-moz-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-ms-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            '-o-transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)',
            'transform': 'translate3d('+randomIntFromInterval(-69, 69)+'px, '+randomIntFromInterval(-69, 69)+'px, 0)'
        });
    });
}
function implodeLetter(parentID, letter) {
    $('#'+parentID+' .word-digital .letter.'+letter).find('rect').css({
        'fill': '#fff',
        '-webkit-transform': 'translate3d(0, 0, 0)',
        '-moz-transform': 'translate3d(0, 0, 0)',
        '-ms-transform': 'translate3d(0, 0, 0)',
        '-o-transform': 'translate3d(0, 0, 0)',
        'transform': 'translate3d(0, 0, 0)'
    });
}
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
function introStuff() {
    $('body').addClass('show-background');
    setTimeout(function() {
        $('body').addClass('show-stars');

        $('.hover-block.d').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.d').trigger("mouseout");
        }, 700);


        $('.hover-block.i-1').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-1').trigger("mouseout");
        }, 700);

        $('.hover-block.g').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.g').trigger("mouseout");
        }, 700);


        $('.hover-block.i-2').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.i-2').trigger("mouseout");
        }, 700);

        $('.hover-block.t').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.t').trigger("mouseout");
        }, 700);

        $('.hover-block.a').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.a').trigger("mouseout");
        }, 700);

        $('.hover-block.l').trigger("mouseover");
        setTimeout(function() {
            $('.hover-block.l').trigger("mouseout");
        }, 700);

    }, 500);
}

particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 100
    },
    "color": {
      "value": "#d4d4d4"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.5
    },
    "size": {
      "value": 3,
      "random": true
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "top",
      "random": true
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onclick": {
        "enable": true,
        "mode": "push"
      }
    }
  },
  "retina_detect": true
});
