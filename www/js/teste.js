/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var src = "http://www.excelinformatica.com.br/appjudge/lucas.jpg";


function teste(){
$('#div').prepend('<img id="theImg" src="" />');

 var img = document.getElementById('theImg');

img.src = src;

}