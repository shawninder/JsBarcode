function EAN(string){
	//Regexp to test if the EAN code is correct formated
	var fullEanRegexp = /^[0-9]{13}$/;
	var needLastDigitRegexp = /^[0-9]{12}$/;

	//Add checksum if it does not exist
	if(string.search(needLastDigitRegexp)!=-1){
		string += checksum(string);
	}

	this.getText = function(){
		return string;
	};

	this.valid = function(){
		return valid(string);
	};

	this.encoded = function (){
		return createEAN13(string);
	}

	var EAN13structure = [
		"LLLLLL",
		"LLGLGG",
		"LLGGLG",
		"LLGGGL",
		"LGLLGG",
		"LGGLLG",
		"LGGGLL",
		"LGLGLG",
		"LGLGGL",
		"LGGLGL"
	];

	//Create the binary representation of the EAN code
	//number needs to be a string
	function createEAN13(number){
		var encoder = new EANencoder();

		//Create the return variable
		var result = "";

		var structure = EAN13structure[number[0]];

		//Get the number to be encoded on the left side of the EAN code
		var leftSide = number.substr(1,7);

		//Get the number to be encoded on the right side of the EAN code
		var rightSide = number.substr(7,6);

		//Add the start bits
		result += encoder.startBin;

		//Add the left side
		result += encoder.encode(leftSide, structure);

		//Add the middle bits
		result += encoder.middleBin;

		//Add the right side
		result += encoder.encode(rightSide,"RRRRRR");

		//Add the end bits
		result += encoder.endBin;

		return result;
	}

	//Calulate the checksum digit
	function checksum(number){
		var result = 0;

		for(var i=0;i<12;i+=2){result+=parseInt(number[i],10)}
		for(var i=1;i<12;i+=2){result+=parseInt(number[i],10)*3}

		return (10 - (result % 10)) % 10;
	}

	function valid(number){
		if(number.search(fullEanRegexp)!=-1){
			return number[12] == checksum(number);
		}
		else{
			return false;
		}
	}
}

function EAN8(string){
	//Regexp to test if the EAN code is correct formated
	var fullEanRegexp = /^[0-9]{8}$/;
	var needLastDigitRegexp = /^[0-9]{7}$/;

	//Add checksum if it does not exist
	if(string.search(needLastDigitRegexp)!=-1){
		string += checksum(string);
	}

	this.getText = function(){
		return string;
	}

	this.valid = function(){
		return string.search(fullEanRegexp) !== -1
			&& string[7] == checksum(string);
	};

	this.encoded = function (){
		return createEAN8(string);
	}

	//Calulate the checksum digit
	function checksum(number){
		var result = 0;

		for(var i=0;i<7;i+=2){result+=parseInt(number[i],10)*3}
		for(var i=1;i<7;i+=2){result+=parseInt(number[i],10)}

		return (10 - (result % 10)) % 10;
	}

	function createEAN8(number){
		var encoder = new EANencoder();

		//Create the return variable
		var result = "";

		//Get the number to be encoded on the left side of the EAN code
		var leftSide = number.substr(0,4);

		//Get the number to be encoded on the right side of the EAN code
		var rightSide = number.substr(4,4);

		//Add the start bits
		result += encoder.startBin;

		//Add the left side
		result += encoder.encode(leftSide, "LLLL");

		//Add the middle bits
		result += encoder.middleBin;

		//Add the right side
		result += encoder.encode(rightSide,"RRRR");

		//Add the end bits
		result += encoder.endBin;

		return result;
	}
}

function EAN5(string){
	//Regexp to test if the EAN code is correct formated
	var fullEanRegexp = /^[0-9]{5}$/;

	this.getText = function(){
		return string;
	}

	this.valid = function(){
		return string.search(fullEanRegexp)!==-1;
	};

	this.encoded = function (){
		return createEAN5(string);
	}

	//Calulate the checksum digit
	function checksum(number){
		var result = 0;

		for(var i=0;i<5;i+=2){result+=parseInt(number[i],10)*3}
		for(var i=1;i<5;i+=2){result+=parseInt(number[i],10)*9}

		return result % 10;
	}

	var EAN5structure = [
		"GGLLL",
		"GLGLL",
		"GLLGL",
		"GLLLG",
		"LGGLL",
		"LLGGL",
		"LLLGG",
		"LGLGL",
		"LGLLG",
		"LLGLG"
	];

	function createEAN5(number){
		var encoder = new EANencoder();

		//Create the return variable
		var result = "1011";

		// Add the encodings
		result += encoder.encode(number, EAN5structure[checksum(number)], "01");

		return result;
	}
}

function EAN2(string){
	//Regexp to test if the EAN code is correct formated
	var fullEanRegexp = /^[0-9]{2}$/;

	this.getText = function(){
		return string;
	}

	this.valid = function(){
		return string.search(fullEanRegexp)!==-1;
	};

	this.encoded = function (){
		return createEAN2(string);
	}

	var EAN2structure = ["LL", "LG", "GL", "GG"]

	function createEAN2(number){
		var encoder = new EANencoder();

		//Create the return variable
		var result = "1011";

		// Add the encodings
		result += encoder.encode(number, EAN2structure[parseInt(number,10) % 4], "01");

		return result;
	}
}

function UPC(string){
	var ean = new EAN("0"+string);

	this.getText = function(){
		return ean.getText().substring(1);
	}

	this.valid = function(){
		return ean.valid();
	}

	this.encoded = function(){
		return ean.encoded();
	}
}

//
// Help class that does all the encoding
//
function EANencoder(){
	//The start bits
	this.startBin = "101";
	//The end bits
	this.endBin = "101";
	//The middle bits
	this.middleBin = "01010";

	//The L (left) type of encoding
	var Lbinary = [
		"0001101",
		"0011001",
		"0010011",
		"0111101",
		"0100011",
		"0110001",
		"0101111",
		"0111011",
		"0110111",
		"0001011"
	];

	//The G type of encoding
	var Gbinary = [
		"0100111",
		"0110011",
		"0011011",
		"0100001",
		"0011101",
		"0111001",
		"0000101",
		"0010001",
		"0001001",
		"0010111"
	];

	//The R (right) type of encoding
	var Rbinary = [
		"1110010",
		"1100110",
		"1101100",
		"1000010",
		"1011100",
		"1001110",
		"1010000",
		"1000100",
		"1001000",
		"1110100"
	];

	//Convert a numberarray to the representing
	this.encode = function(number, structure, separator){
		//Create the variable that should be returned at the end of the function
		var result = "";

		var separator = typeof separator === "undefined" ? "" : separator;

		//Loop all the numbers
		for(var i = 0;i<number.length;i++){
			//Using the L, G or R encoding and add it to the returning variable
			if(structure[i]=="L"){
				result += Lbinary[number[i]];
			}
			else if(structure[i]=="G"){
				result += Gbinary[number[i]];
			}
			else if(structure[i]=="R"){
				result += Rbinary[number[i]];
			}

			// Add separator
			if(i < number.length - 1){
				result += separator;
			}
		}
		return result;
	};
}


//Required to register for both browser and nodejs
var register = function(core){
	core.register(EAN, /^EAN(.?13)?$/i, 8);
	core.register(EAN8, /^EAN.?8$/i, 8);
	core.register(EAN5, /^EAN.?5$/i, 5);
	core.register(EAN2, /^EAN.?2$/i, 5);
	core.register(UPC, /^UPC(.?A)?$/i, 8);
}
try{register(JsBarcode)} catch(e){}
try{module.exports.register = register} catch(e){}
