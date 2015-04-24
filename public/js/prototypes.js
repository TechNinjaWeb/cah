var br = "\n";
var sec = "-----------";
var secbr = br + sec + br;


"".getVal = function getVal(obj, name) {
	return obj[name];
};


Number.prototype.Ran = function(max, min, num) {
	num = num || 1;
	min = min || 0;
	var maxR = Math.ceil((Math.random())*max);
	var minR = Math.floor((Math.random())*min);
	// console.log("MaxR", maxR, "MinR", minR);
	var r = Math.ceil((Math.round(Math.floor(( maxR + minR )/2) + Math.ceil(( maxR + minR ) /2)) /2) * num);
	// console.warn("Returning This Random Number", r);
	// console.warn("Would Be Returning This Random Number!!", secbr, secbr
	// 	, secbr, Math.ceil((((((r + r) / 2) * Math.PI) / 3)/7)*6.6), secbr, secbr, secbr);
	return r;
};


[].getRandom = function() {
	console.log("Arguments", arguments);
	var obj = Object.create(this.valueOf());
	var objName = arguments.callee.name;
	var a = Array.prototype.splice.call(arguments, 0);
	var lame =[];
	
	// console.log("A IS A -->", a, br);
	// console.log("This is an -->", typeof a, br);
	// console.log("Is It An Array? -->", Array.isArray(a), br);
	// console.log("It's Value Is: ", a, br);
	// console.log("And Has A Lenght Of: ", a.length);

	// console.log("obj IS -->", obj, br);
	// console.log("This is an -->", typeof obj, br);
	// console.log("Is It An Array? -->", Array.isArray(obj), br);
	// console.log("It's Value Is: ", obj, br);
	// console.log("And Has A Lenght Of: ", obj.length);
		
	// Get Token
	var token;
	
	if (obj.length) { token = obj[Number.prototype.Ran(0, obj.length, 1)]; console.log("Here's The Token", token); return token;}
	else { for (p in obj) lame.push(p); };
	console.log("Here's The Token", token);
	var _token = (function genToken() {
		var l = lame[Number.prototype.Ran(0, lame.length, 1)];
		return l != objName ? l : genToken();
	})();	

	console.warn(secbr,"Sending Token", _token, secbr);

	return _token;
};


[].m = function() {
	var s = this;
	// console.log("This?", this);
	return s[0].reduce(function(p,c,i,a){
		// console.log(secbr, "PCIA",br, p, br, c, br, i, br, a, secbr);
		return p > c ? p : c;
	});
};

[].mn = function() {
	var s = this;
	// console.log("This?", this);
	return s[0].reduce(function(p,c,i,a){
		// console.log(secbr, "PCIA",br, p, br, c, br, i, br, a, secbr);
		return p < c ? p : c;
	});
};