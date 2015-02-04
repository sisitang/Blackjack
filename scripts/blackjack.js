//--------- Global variables and objects----------------

// set baseDeck for all cards
var baseDeck = []
var faceup;
// shoe is an array
var shoe = [];
var player = {
		cards : [],
		money: 1000,
		bet:0,
		value:0,
		id: 'player',
		hit: function(){
			getCard(this);
			if(this.value > 21){
				return "bust";
			}else return "okay";
		}
	};
var dealer = {
		cards : [],
		realvalue:0,
		value : 0,
		id: 'dealer',
		play: function() {
			if(this.realvalue<17){
				getCard(this)
			};
			while(this.realvalue<player.value){
				getCard(this);
			}
			
			//show dealer's real value and the first card
      		showDealer();
			
			if(this.realvalue>21 || this.realvalue<player.value){
				console.log('dealer loose');
				return "loose";
			}else if(this.realvalue == player.value){
				console.log('tie');
				return "tie";
			}else return "win";
		},

	};

var chipPos = 100;

var cardZIndex = 200;
var num = 0;
var countdown_num = 0;
var killtime;
var killdance;
//--------------End of global variables and objects-------------


//------------Functions-----------------------------------------

//show the dealer's facedown card and real value
function showDealer(){
			$('.curValue.dealer').html(dealer.realvalue);
			$('#gameField img').eq(50).animate({
				left:430,
				top:150
			});
			setTimeout(function(){
				$('#gameField img').eq(50).hide();
				$('.showDealer_container img').show();
				$('#face').attr('src','images/cards/facedown.png');
				$('#back').attr('src','images/cards/'+faceup+'.png');
				$('.showDealer_container').addClass('active');
            },400);
}

//Shuffle --- set the shoe with 52 cards in a random order  

function shuffle(){
	resetBaseDeck();
	shoe = baseDeck;
	
	for (var i=0; i<shoe.length; i++){
		var randomPos = Math.floor(Math.random()*52);
		var currentPos = shoe[i];
		shoe[i] = shoe[randomPos];
		shoe[randomPos] = currentPos;
	}
} 

function showMoneyBet(){
	$('#money').children('span').fadeOut('fast').text(player.money).fadeIn('fast');
	$('#bet').children('span').fadeOut('fast').text(player.bet).fadeIn('fast');
}

function getCard(playObject){
	playObject.cards.push(shoe.shift());
	
	var id = playObject.id;
	if (shoe.length == 0){shuffle();}
	checkCardsValue(playObject);
	showCard(playObject);
}

//algorithm of Blackjack
function checkCardsValue(playObject) { 		
		var handValue = 0;
		var acePos=0;
		for(card in playObject.cards){
			var cardNum = parseInt(playObject.cards[card].slice(1));
			if(cardNum <= 10){
                handValue += cardNum
            }else if(cardNum < 14){
                handValue += 10
            }else{
                acePos++
            }
		}
		if(acePos>0){
			for(var i=1; i<=acePos; i++){
				if((handValue+11)>21){
                    handValue+=1
				}else handValue+=11;
			}
		}
		if (playObject.id == 'dealer'){
			playObject.realvalue = handValue;
			//show the second card's value
			var secondCardValue = parseInt(String(playObject.cards[1]).slice(1));
			if (secondCardValue > 10){
				secondCardValue = 10;
			}else if(secondCardValue == 14){
				secondCardValue = 11;
			} 
			playObject.value = secondCardValue; 
			
			console.log(playObject.realvalue);
		}else{
			playObject.value = handValue;
		}
}

function showCard(playObject){
	var showTop = '';
	if(playObject.id == 'player'){
		showTop = 430
	}else{ showTop = 20}
	var currentCardIndex = playObject.cards.length-1;
	$('#gameField img')
	.eq(shoe.length)
	.css('z-index', cardZIndex++)
	.show()
	.css('position','absolute')
	.animate({
			top: showTop,
			left: 530-(currentCardIndex*45)
		},{queue:true, duration : 500});
	$('.curValue.'+playObject.id).html(playObject.value);
}


function imagePreload() {
	for(var i=0; i<shoe.length; i++) {
		if (i== 1){
			$('#gameField').prepend('<img class="cardM" width="80px" height="116px" src="images/cards/facedown.png" alt="card"/>\n')
			faceup = shoe[i];
			console.log('this is facedown:'+faceup);
		}
		else {$('#gameField').prepend('<img class="cardM" width="80px" height="116px" src="images/cards/'+shoe[i]+'.png" alt="card"/>\n')}
	}
}	


//Show this hand's result and start a new hand
function endThisHand() {
	//show this hand result -- show the message 
	$('#resultMessage').slideToggle('fast');
	//reset the player and dealer except the player's money	
	player.bet=0;
	player.value=0;
	player.cards=[];
	dealer.cards=[];
	dealer.value=0;
	dealer.realvalue=0;
	//show the rest of player's money
	showMoneyBet();

	//reset the deck
	
	$('#deal, #stay, #hit').hide();
	setTimeout(function() {
		$('#gameField,#betChips, .curValue').empty();
		$('#resultMessage').fadeOut('slow');
		$('#resultMessage').empty();
		
		$('.showDealer_container img').hide();
		$('.showDealer_container').removeClass('active');

		// shuffle and preload cards after each hand
		shuffle();
		imagePreload();
		$('#chips img:not(:first-child)').remove();
		$('#chips img:first-child').fadeIn('slow')
	}, 4000)
	
}


function resetBaseDeck(){
 baseDeck = [	
        'd02','d03','d04','d05','d06','d07','d08','d09','d10','d11','d12','d13','d14',
		'h02','h03','h04','h05','h06','h07','h08','h09','h10','h11','h12','h13','h14',
		'c02','c03','c04','c05','c06','c07','c08','c09','c10','c11','c12','c13','c14',
		's02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14'
		]	
}


function rollBall(){
	num++;
	$(".animation_img").animate({top:"+=20"},150).animate({top:"-=20"},150)
	if(num<4){
		killtime = setTimeout("rollBall()",100);
	} 
}

function countdown(){
	countdown_num++;
	if(countdown_num == 4){
		$(".cover span").html("Go!");
	}else $(".cover span").html(4-countdown_num);
	if(countdown_num<4){
		setTimeout("countdown()",1000);
	} else {
		$(".cover span").fadeOut(1000);
	}	
}
//--------------End of functions--------------------------------


//--------main function--------------------------
$(document).ready(function(){

    //step 0: unveil
	countdown();
	$('.cover').delay('3000').slideUp(3000);

    //step 1: shuffle and preload images
	shuffle();
	imagePreload();
	
	//step 2: bet 1)clips' animation 2)money calculation
	$('.chip').click(function() {
		//put chips into bet and each chip has a slightly different position
		//appended chips can not be affected:)
		var chipValue=parseInt(($(this).attr('class')).substr(6,3));

		if( (player.money - chipValue)<0){
			alert("You money is not enough!");
		}else{
			$('.newGame').fadeIn('slow');
			var randomPos = Math.floor(Math.random()*30); 
			var ranLeft= 400-$(this).offsetParent().position().left+randomPos*2; 
			var ranBot = 200+randomPos*2; 
			$(this)
				.clone()
				.appendTo($(this).offsetParent())
				.css('z-index', ++cardZIndex)
				.animate({
					left: ranLeft,
					bottom: ranBot
				}, 1000);
					player.money -= chipValue;
			player.bet += chipValue;
			//show the deal button
			$('#deal').show();
			
			//show the money and bet
			showMoneyBet();
		}	
	});

	//step 3: click the deal button to start the game
	$('#deal').click(function(){
		//hide the "deal" button and clips
		$('#deal, #chips img:first-child').hide();
		
		//give the dealer and player 2 cards each person  
		for(var i=0; i<2; i++){
			getCard(player);
			getCard(dealer);
		}
		if(player.value == 21 && dealer.realvalue == 21){
			showDealer();
			//reture all the bet
			player.money = player.money + player.bet;
			$('#resultMessage').prepend(' <span style="color:yellow">WOW! A push!</span>');
			endThisHand();
		}else if(player.value == 21 ){
			showDealer();
			player.money = player.money + player.bet*3;
			$('#resultMessage').prepend('You <span style="color:#00ff00">win</span> $'+player.bet*3+'!');
			endThisHand();		
		}else{
			$('#hit, #stay').show();
		}
	})	
	
	//step 4: player's turn: choose hit or stay 
	$('#hit').click(function(){
		//if bust, end this hand
		if (player.hit() == 'bust'){
			showDealer();
			$('#resultMessage').prepend('Bust! You <span style="color:red">loose</span> $'+player.bet+'!');
			endThisHand();
		}
	})
	
	//step 5: dealer's turn 
	$('#stay').click(function(){
		
		if(dealer.play()=='loose') {
			player.money = player.money + player.bet*3;
			$('#resultMessage').prepend('You <span style="color:green">win</span> $'+player.bet*3+'!');
		}else if(dealer.play()=='tie'){
			player.money = player.money + player.bet;
 			$('#resultMessage').prepend(' <span style="color:yellow">WOW! A push!</span>');
		}else {
			$('#resultMessage').prepend('You <span style="color:red">loose</span> $'+player.bet+'!');
		}
		console.log($('#resultMessage').html());
		endThisHand();
	});
	
	
    // start a new game
	$('.newGame').click(function(){
		//reset the player and dealer
		console.log("ok");
		player.bet=0;
		player.value=0;
		player.money=1000;
		player.cards=[];
		dealer.cards=[];
		dealer.value=0;
		showMoneyBet();
		//reset the deck
		$('#deal, #stay, #hit').hide();
		$('#gameField,#betChips, .curValue,#resultMessage').empty();
		// shuffle and preload cards after each hand
		shuffle();
		imagePreload();
		$('#chips img:not(:first-child)').remove();
		$('#chips img:first-child').fadeIn('slow');
		$('.newGame').fadeOut('slow');
	})
	
	//set a blink odie
	setInterval( function() {
	if(!$(".newGame").is(":hover")){

	  $(".newGame").css("opacity",0.5);
	  window.setTimeout(function(){
      	$(".newGame").css("opacity",0.6);
        }, 500);
	}
	else{$(".newGame").css("opacity",1);}
	  },1000 );
	  
	//show animation_img :))
	
	$('.garfield').click(function(){
		if($('.animation_img').is(':visible')){
			clearTimeout(killtime);
			$('.animation_img').fadeOut('slow');
			$('#rules').fadeOut('slow');
			$('.animation_img').css('top',140).css('left',-70);
			num=0;
		}else{
			$('.animation_img').fadeIn('slow');
			$('#rules').fadeIn('slow');
			rollBall();
		}
	});
	$('#suffle').click(function(){
		alert("Welcome to my game!");
	})

})



//---------end of main function---------------------