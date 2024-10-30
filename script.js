$(document).ready(function() {
    var i, j;
    var jml_kotak = 15; 
    var skor = 0; 
    var total_skor = 0; 

    var kotak_data = new Array();
    var jawaban = new Array();
    var salah = new Array();

    // Set grid template
    $(".grid").css("grid-template", "repeat(" + jml_kotak + ", 10%)/repeat(" + jml_kotak + ", 10%)");

    // Initialize grid data
    for (i = 0; i < jml_kotak; i++) {
        kotak_data[i] = new Array();
        for (j = 0; j < jml_kotak; j++) {
            kotak_data[i][j] = new Array();
            kotak_data[i][j][0] = false;   
            kotak_data[i][j][1] = true;     
            kotak_data[i][j][2] = false;    
            kotak_data[i][j][3] = -1;      
            kotak_data[i][j][4] = "";       
            kotak_data[i][j][5] = "";      
        }
    }

    
    $.each(quiz, function(index, value) {
        var len = value[3].length;
        var bo = new Array();

        kotak_data[value[0]][value[1]][2] = true;
        kotak_data[value[0]][value[1]][3] = (index + 1);

        if (value[4] === "turun") {
            $("#menurun").append("<font class='question' id='q" + (index) + "'>" + (index + 1) + ". " + value[2] + "</font><br>");
        } else if (value[4] === "datar") {
            $("#mendatar").append("<font class='question' id='q" + (index) + "'>" + (index + 1) + ". " + value[2] + "</font><br>");
        }


        for (var a = 0; a < len; a++) {
            var row = value[0] + (value[4] === "turun" ? a : 0);
            var col = value[1] + (value[4] === "datar" ? a : 0);
            var ay = [row, col];

            kotak_data[row][col][0] = true;
            kotak_data[row][col][4] = value[3].charAt(a); 
            bo.push(ay);
        }
        jawaban.push(bo); 

        total_skor += len; 
    });

    for (i = 0; i < jml_kotak; i++) {
        for (j = 0; j < jml_kotak; j++) {
            var y = $("<span>").addClass("grid__item grid_" + i + "_" + j);

            if (kotak_data[i][j][0] === true && kotak_data[i][j][1] === true) {
                var g;

                if (kotak_data[i][j][2] === true) {  
                    g = $('<input/>').attr({ type: 'text', class: 'for-tts', maxlength: '1', placeholder: kotak_data[i][j][3], row: i, col: j });
                } else {
                    g = $('<input/>').attr({ type: 'text', class: 'for-tts', maxlength: '1', row: i, col: j });
                }

                g.appendTo(y);
            }
            $(".grid").append(y); 
        }
    }

    $("#skor").html(skor + "/" + total_skor); 

    // Handle user input
    $(".for-tts").on('input propertychange paste', function() {
        var huruf = $(this).val().toUpperCase();
        var row = $(this).attr("row");
        var col = $(this).attr("col");

        kotak_data[row][col][5] = huruf; 
    });

 
    $("#btn_cek").click(function() {
        salah = new Array();
        skor = 0;  

        $(".grid__item").removeClass("input-salah");
        $(".question").removeClass("salah");
        $(".question").addClass("benar");

        $.each(quiz, function(index, value) {
            var jwb_data = jawaban[index];
            var kurang = 0;

            $.each(jwb_data, function(index2, value2) {
                if (kotak_data[value2[0]][value2[1]][4] != kotak_data[value2[0]][value2[1]][5]) {
                    kurang++;
                    $(".grid_" + value2[0] + "_" + value2[1]).addClass("input-salah");
                } else {
                    skor++;
                }
            });

            if (kurang > 0) salah.push(index); 
        });

        $("#skor").html(skor + "/" + total_skor); 
      
        $.each(salah, function(i, v) {
            $("#q" + v).removeClass("benar").addClass("salah");
        });
    });

    $("#btn_show_answers").click(function() {
        $.each(quiz, function(index, value) {
            var jwb_data = jawaban[index];
            $.each(jwb_data, function(index2, value2) {
                $(".grid_" + value2[0] + "_" + value2[1] + " input").val(kotak_data[value2[0]][value2[1]][4]); // Show correct answer
            });
        });
    });
});

function saveName() {
    const name = document.getElementById('playerName').value;
    if (name) {
        localStorage.setItem('playerName', name); 
        window.location.href = "puzzle.html"; 
    }
}

window.onload = function() {
    const name = localStorage.getItem('playerName');
    if (name) {
        document.getElementById('greeting').innerText = `Hallo, ${name}! Selamat bermain teka teki silang.`;
    } else {
        document.getElementById('greeting').innerText = 'Hallo! Selamat bermain teka teki silang.';
    }
}

document.getElementById('btn_show_answers').addEventListener('click', function() {
    const score = document.getElementById('skor').innerText; 
    const confirmation = confirm('Apakah Anda yakin ingin menyerah? Skor akhir Anda akan muncul.');
    
    if (confirmation) {
        alert('Skor akhir Anda adalah: ' + score);
    }
});

document.getElementById('btn_reset').addEventListener('click', function() {
    location.reload();  
});