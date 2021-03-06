
setAcceleration(function(x,y){
  //return new Vector(-1*(x-canvas.width/2),-1*(y-canvas.width/2)).divided(1000);
  return new Vector(0,.02);
});

var sounds = [];

var playSound = function(sound,vol){
	if(!sounds[sound]){
		sounds[sound] = new Audio('sounds/' + sound);
	}
	sounds[sound].volume = vol;
	sounds[sound].play();
}

var build1 = function(){
	clearAll();
	var stat = function(x0,y0,x1,y1){
		addStatic(new LineSegment(new Vector(x0,y0), new Vector(x1,y1)));
	}
	var lastStroke = new Vector(0,0);
	var moveTo = function(x,y){
		lastStroke = new Vector(x,y);
	}
	var strokeTo = function(x,y){
		var vec = new Vector(x,y);
		addStatic(new LineSegment(lastStroke,vec));
		lastStroke = vec;
	}
	var rubber = new Material(.4,"black",function(vol){
		if(vol<.05)vol*=vol;
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-06.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});
	var bouncey = new Material(2,"red",function(vol){
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-15.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});
	var wood = new Material(.95, "blue", function(vol){
		vol = Math.min(vol,1);
		var sounds = ["Percussive Elements-04.wav",
		"Percussive Elements-05.wav"],
		i = Math.floor(Math.random()*sounds.length);
		playSound(sounds[i],vol);
	});
	setMaterial(wood);
	moveTo(6,217);
	strokeTo(19,215);
	strokeTo(24,212);
	strokeTo(25,206);
	strokeTo(22,184.25);
	strokeTo(18,160.25);
	strokeTo(15,134.25);
	strokeTo(15,120.25);
	strokeTo(18,106.25);
	strokeTo(20,94.25);
	strokeTo(25,82.25);
	strokeTo(31,70.25);
	strokeTo(40,57.25);
	strokeTo(51,45.25);
	strokeTo(65,34.25);
	strokeTo(76,28.25);
	strokeTo(93,22.25);
	strokeTo(106,20.25);
	strokeTo(196,20.25);
	strokeTo(198,18.25);
	strokeTo(198,4);
	strokeTo(2,4);
	strokeTo(6,218.25);
	strokeTo(6,217);
	moveTo(202.25,5);
	strokeTo(201.25,17);
	strokeTo(202.25,19);
	strokeTo(205.25,20);
	strokeTo(292.25,20);
	setMaterial(rubber);
	strokeTo(296.25,22);
	strokeTo(298.25,26);
	strokeTo(298.25,42);
	strokeTo(300.25,45);
	setMaterial(wood);
	strokeTo(368.25,75);
	strokeTo(379.25,85);
	strokeTo(391.25,101);
	strokeTo(400.25,112);
	strokeTo(411.25,132);
	strokeTo(417.25,148);
	strokeTo(422.25,171);
	strokeTo(424.25,189);
	strokeTo(424.25,214);
	strokeTo(426.25,218);
	strokeTo(436.25,218);
	strokeTo(436.25,7);
	strokeTo(202.25,4);
	strokeTo(202.25,5);

	moveTo(295,110);
	strokeTo(295,83);
	strokeTo(291,83);
	strokeTo(288,78);
	strokeTo(284,78);
	strokeTo(283,82);
	strokeTo(279,83);
	strokeTo(279,111);
	strokeTo(282,111);
	strokeTo(284,115);
	strokeTo(288,115);
	strokeTo(290,112);
	strokeTo(294,112);
	strokeTo(295,110);
	moveTo(256,76);
	strokeTo(256,104);
	strokeTo(252,104);
	strokeTo(250,107);
	strokeTo(247,107);
	strokeTo(244,104);
	strokeTo(240,103);
	strokeTo(240,76);
	strokeTo(244,76);
	strokeTo(246,72);
	strokeTo(249,72);
	strokeTo(252,76);
	strokeTo(256,76);
	moveTo(184,66);
	strokeTo(184,65);
	strokeTo(186,61);
	strokeTo(193,62);
	strokeTo(213,66);
	strokeTo(216,72);
	strokeTo(216,98);
	strokeTo(215,102);
	strokeTo(212,104);
	strokeTo(189,104);
	strokeTo(186,102);
	strokeTo(184,99);
	strokeTo(184,66);
	moveTo(162,88);
	strokeTo(162,62);
	strokeTo(160,60);
	strokeTo(157,60);
	strokeTo(153,57);
	strokeTo(150,56);
	strokeTo(149,60);
	strokeTo(145,61);
	strokeTo(145,86);
	strokeTo(148,88);
	strokeTo(150,91);
	strokeTo(155,92);
	strokeTo(157,88);
	strokeTo(162,88);
	moveTo(105,83);
	strokeTo(111,83);
	strokeTo(114,86);
	strokeTo(117,86);
	strokeTo(119,82);
	strokeTo(123,83);
	strokeTo(123,53);
	strokeTo(118,53);
	strokeTo(115,49);
	strokeTo(111,50);
	strokeTo(109,53);
	strokeTo(109,56);
	strokeTo(107,61);
	strokeTo(104,63);
	strokeTo(103,66);
	strokeTo(105,83);

	moveTo(5,220.40000915527344);
	strokeTo(15,215.40000915527344);
	strokeTo(21,214.40000915527344);
	strokeTo(24,216.40000915527344);
	strokeTo(27,219.40000915527344);
	strokeTo(32,240.40000915527344);
	strokeTo(84,421.40000915527344);
	strokeTo(85,430.40000915527344);
	strokeTo(82,436.40000915527344);
	strokeTo(78,438.40000915527344);
	strokeTo(72,439.40000915527344);
	strokeTo(68,438.40000915527344);
	strokeTo(64,436.40000915527344);
	strokeTo(61,430.40000915527344);
	strokeTo(44,369.40000915527344);
	strokeTo(42,362.40000915527344);
	strokeTo(33,357.40000915527344);
	strokeTo(26,355.40000915527344);
	strokeTo(19,358.40000915527344);
	strokeTo(14,362.40000915527344);
	strokeTo(11,367.40000915527344);
	strokeTo(10,374.40000915527344);
	strokeTo(12,383.40000915527344);
	strokeTo(19,414.40000915527344);
	strokeTo(26,436.40000915527344);
	strokeTo(34,453.40000915527344);
	strokeTo(47,478.40000915527344);
	strokeTo(60,502.40000915527344);
	strokeTo(62,506.40000915527344);
	strokeTo(62,510.40000915527344);
	strokeTo(59,514.4000091552734);
	strokeTo(52,519.4000091552734);
	strokeTo(43,524.4000091552734);
	strokeTo(35,529.4000091552734);
	strokeTo(25,541.4000091552734);
	strokeTo(18,552.4000091552734);
	strokeTo(17,564.4000091552734);
	strokeTo(16,583.4000091552734);
	strokeTo(16,598.4000091552734);
	strokeTo(16,600);
	strokeTo(8,600);
	strokeTo(4,223.60000610351562);
	strokeTo(5,220.40000915527344);
	moveTo(382.25,218);
	strokeTo(384.25,218);
	strokeTo(387.25,217);
	strokeTo(388.25,215);
	strokeTo(390.6000061035156,208.4000015258789);
	strokeTo(390.6000061035156,201.4000015258789);
	strokeTo(391.6000061035156,189.4000015258789);
	strokeTo(390.6000061035156,174.4000015258789);
	strokeTo(388.6000061035156,164.4000015258789);
	strokeTo(385.6000061035156,155.4000015258789);
	strokeTo(383.6000061035156,148.4000015258789);
	strokeTo(378.6000061035156,137.4000015258789);
	strokeTo(369.6000061035156,124.60000228881836);
	strokeTo(357.6000061035156,112.60000228881836);
	strokeTo(346.6000061035156,102.60000228881836);
	strokeTo(328.6000061035156,91.60000228881836);
	strokeTo(313.6000061035156,84.60000228881836);
	strokeTo(301.6000061035156,81.60000228881836);
	strokeTo(298.6000061035156,82.60000228881836);
	strokeTo(294.6000061035156,86.60000228881836);
	strokeTo(294.6000061035156,90.60000228881836);
	strokeTo(295.6000061035156,112.60000228881836);
	strokeTo(292.6000061035156,116.60000228881836);
	strokeTo(289.6000061035156,118.60000228881836);
	strokeTo(279.6000061035156,118.60000228881836);
	strokeTo(277.6000061035156,121.60000228881836);
	setMaterial(bouncey);
	strokeTo(279.6000061035156,124.60000228881836);//bouncey
	strokeTo(321.6000061035156,155.60000228881836);//bouncey
	strokeTo(323.6000061035156,160.60000228881836);//bouncey
	setMaterial(wood);
	strokeTo(323.6000061035156,210.60000228881836);
	strokeTo(325.6000061035156,214.60000228881836);
	strokeTo(329.6000061035156,216.60000228881836);
	strokeTo(333.6000061035156,216.60000228881836);
	strokeTo(337.6000061035156,214.60000228881836);
	strokeTo(340.6000061035156,210.60000228881836);
	strokeTo(340.6000061035156,204.60000228881836);
	strokeTo(340.6000061035156,188.60000228881836);
	strokeTo(338.6000061035156,178.60000228881836);
	strokeTo(337.6000061035156,173.60000228881836);
	strokeTo(337.6000061035156,165.60000228881836);
	strokeTo(339.6000061035156,159.60000228881836);
	strokeTo(345.6000061035156,154.60000228881836);
	strokeTo(351.6000061035156,151.60000228881836);
	strokeTo(362.6000061035156,151.60000228881836);
	strokeTo(369.6000061035156,154.60000228881836);
	strokeTo(375.6000061035156,160.60000228881836);
	strokeTo(378.6000061035156,171.60000228881836);
	strokeTo(380.6000061035156,182.60000228881836);
	strokeTo(380.6000061035156,191.60000228881836);
	strokeTo(380.6000061035156,204.60000228881836);
	strokeTo(378.6000061035156,210.60000228881836);
	strokeTo(378.6000061035156,212.60000228881836);
	strokeTo(382.25,218);
	moveTo(426,813.3333740234375);
	strokeTo(426,687.3333740234375);
	strokeTo(426,567.6666870117188);
	strokeTo(426,477.66668701171875);
	strokeTo(426,218);
	strokeTo(435,218);
	strokeTo(435,815);
	strokeTo(426,813.3333740234375);
	moveTo(75,188);
	strokeTo(85,143);
	setMaterial(bouncey);
	strokeTo(89,138);//bouncey
	strokeTo(122,93);//bouncey
	strokeTo(123,89);//bouncey
	strokeTo(120,87);//bouncey
	strokeTo(117,87);//bouncey
	strokeTo(114,89);//bouncey
	strokeTo(109,90);//bouncey
	strokeTo(106,85);//bouncey
	strokeTo(104,79);//bouncey
	strokeTo(104,65);//bouncey
	setMaterial(wood);
	strokeTo(105,58);
	strokeTo(108,55);
	strokeTo(108,51);
	strokeTo(104,50);
	strokeTo(94,51);
	strokeTo(82,55);
	strokeTo(69,65);
	strokeTo(58,77);
	strokeTo(51,94);
	strokeTo(51,118);
	strokeTo(60,178);
	strokeTo(63,183);
	strokeTo(66,185);
	strokeTo(70,187);
	strokeTo(75,188);
	setMaterial(rubber);
	moveTo(52,676);
	strokeTo(68,700);
	strokeTo(116,729);
	strokeTo(116,732);
	strokeTo(114,734);
	strokeTo(112,736);
	strokeTo(110,739);
	strokeTo(109,741);
	strokeTo(109,742);
	strokeTo(105,744);
	strokeTo(68,722);
	strokeTo(63,721);
	strokeTo(61,723);
	strokeTo(57,726);
	strokeTo(54,727);
	strokeTo(50,725);
	strokeTo(49,721);
	strokeTo(50,678);
	strokeTo(52,676);
	moveTo(8,600.8000183105469);
	strokeTo(16,600.8000183105469);
	strokeTo(18,743.8000183105469);
	strokeTo(10,742.8000183105469);
	strokeTo(8,631.8000183105469);
	strokeTo(8,600.8000183105469);
	moveTo(289.25,729.75);
	strokeTo(340.25,700.75);
	strokeTo(347.25,695.75);
	strokeTo(350.25,690.75);
	strokeTo(351.25,684.75);
	strokeTo(353.25,680.75);
	strokeTo(354.25,680.75);
	strokeTo(355.25,680.75);
	strokeTo(356.25,692.75);
	strokeTo(355.25,700.75);
	strokeTo(352.25,707.75);
	strokeTo(347.25,713.75);
	strokeTo(338.25,721.75);
	strokeTo(312.25,736.75);
	strokeTo(295.25,744.75);
	strokeTo(289.25,732.75);
	strokeTo(289.25,729.75);
	moveTo(10,742.75);
	strokeTo(19,743.75);
	strokeTo(167,829.75);
	strokeTo(167,832.75);
	strokeTo(240,833.75);
	strokeTo(240,831.75);
	strokeTo(387.25,743.75);
	strokeTo(397.25,744.75);
	strokeTo(396.25,902.75);
	strokeTo(12,901.75);
	strokeTo(10,742.75);
	moveTo(397.25,745);
	strokeTo(396.25,602.5);
	strokeTo(387.25,601.5);
	strokeTo(388.25,744.75);
	strokeTo(397.25,745);
	
	setMaterial(wood);
	moveTo(131.20000076293945,266);//9
	strokeTo(136.20000076293945,270);
	strokeTo(142.20000076293945,274);
	strokeTo(148.20000076293945,276);
	strokeTo(154.20000076293945,276);
	strokeTo(162.20000076293945,275);
	strokeTo(166.20000076293945,272);
	strokeTo(171.20000076293945,269);
	strokeTo(174.20000076293945,269);
	strokeTo(178.20000076293945,269);
	strokeTo(182.20000076293945,272);
	strokeTo(183.20000076293945,276);
	strokeTo(182.20000076293945,281);
	strokeTo(180.20000076293945,283);//
	setMaterial(bouncey);
	strokeTo(117.20000076293945,301);
	setMaterial(wood);
	strokeTo(112.20000076293945,300);
	strokeTo(108.20000076293945,297);
	strokeTo(107.20000076293945,292);
	strokeTo(108.20000076293945,289);
	setMaterial(wood);
	strokeTo(111.20000076293945,286);
	setMaterial(bouncey);
	strokeTo(131.20000076293945,266);

	setMaterial(bouncey);
	moveTo(272.20000076293945,292.40000915527344);//bouncey
	strokeTo(291.20000076293945,310.40000915527344);
	setMaterial(wood);
	strokeTo(292.20000076293945,317.40000915527344);
	strokeTo(292.20000076293945,319.40000915527344);
	strokeTo(290.20000076293945,321.40000915527344);
	strokeTo(286.20000076293945,323.40000915527344);
	strokeTo(282.20000076293945,323.40000915527344);
	setMaterial(bouncey);
	strokeTo(223.20000076293945,308.40000915527344);
	setMaterial(wood);
	strokeTo(220.20000076293945,305.40000915527344);
	strokeTo(217.20000076293945,300.40000915527344);
	strokeTo(218.20000076293945,296.40000915527344);
	strokeTo(221.20000076293945,293.40000915527344);
	strokeTo(225.20000076293945,291.40000915527344);
	strokeTo(230.20000076293945,290.40000915527344);
	strokeTo(233.20000076293945,291.40000915527344);
	strokeTo(236.20000076293945,294.40000915527344);
	strokeTo(239.20000076293945,296.40000915527344);
	strokeTo(245.20000076293945,299.40000915527344);
	strokeTo(251.20000076293945,299.40000915527344);
	strokeTo(260.20000076293945,300.40000915527344);
	strokeTo(266.20000076293945,296.40000915527344);
	strokeTo(270.20000076293945,292.40000915527344);
	strokeTo(272.20000076293945,292.40000915527344);
	var off = -5;
	moveTo(146,689 + off);
	strokeTo(147,692 + off);
	strokeTo(148,696 + off);
	strokeTo(149,698 + off);
	strokeTo(149,702 + off);
	strokeTo(148,704 + off);
	strokeTo(147,706 + off);
	strokeTo(145,707 + off);
	strokeTo(143,708 + off);
	strokeTo(139,709 + off);
	strokeTo(134,708 + off);
	strokeTo(130,705 + off);
	strokeTo(93,682 + off);
	strokeTo(89,679 + off);
	strokeTo(88,676 + off);
	strokeTo(85,673 + off);
	strokeTo(85,670 + off);
	strokeTo(85,608 + off);
	strokeTo(85,605 + off);
	strokeTo(87,604 + off);
	strokeTo(88,603 + off);
	strokeTo(91,600 + off);
	strokeTo(93,600 + off);
	strokeTo(96,600 + off);
	strokeTo(98,601 + off);
	strokeTo(101,603 + off);
	strokeTo(105,607 + off);
	setMaterial(bouncey);
	strokeTo(146,689 + off);
	setMaterial(wood);
	moveTo(273.25,707.5);//bouncey
	strokeTo(314.25,683.5);
	strokeTo(320.25,679.5);
	strokeTo(321.25,675.5);
	strokeTo(322.25,668.5);
	strokeTo(322.25,609.5);
	strokeTo(320.25,604.5);
	strokeTo(314.25,601.5);
	strokeTo(309.25,601.5);
	strokeTo(305.25,603.5);
	strokeTo(302.25,608.5);
	setMaterial(bouncey);
	strokeTo(263.25,692.5);
	setMaterial(wood);
	strokeTo(261.25,699.5);
	strokeTo(262.25,702.5);
	strokeTo(265.25,706.5);
	strokeTo(270.25,708.5);
	strokeTo(273.25,707.5);
	moveTo(397.25,358.5);//bouncey
	strokeTo(377.25,358.5);
	strokeTo(350.25,401.5);
	strokeTo(350.25,408.5);
	strokeTo(354.25,412.5);
	strokeTo(358.25,415.5);
	strokeTo(368.25,416.5);
	strokeTo(370.25,421.5);
	strokeTo(389.25,477.5);
	strokeTo(389.25,484.5);
	strokeTo(386.25,489.5);
	strokeTo(377.25,490.5);
	strokeTo(372.25,494.5);
	strokeTo(371.25,503.5);
	strokeTo(387.25,601.5);
	strokeTo(390.25,603.5);
	strokeTo(396.25,602.5);
	strokeTo(397.25,358.5);
	setMaterial(bouncey);
	for(var t=0;t<=1.05;t+=.05){
		var angle = Math.PI*2*t;
		var x = Math.cos(angle)*30 + 153;
		var y = Math.sin(angle)*30 + 246;
		if(t==0)
			moveTo(x,y);
		else
			strokeTo(x,y);
	}
	for(var t=0;t<=1.05;t+=.05){
		var angle = Math.PI*2*t;
		var x = Math.cos(angle)*30 + 252;
		var y = Math.sin(angle)*30 + 270;
		if(t==0)
			moveTo(x,y);
		else
			strokeTo(x,y);
	}
	for(var t=0;t<=1.05;t+=.05){
		var angle = Math.PI*2*t;
		var x = Math.cos(angle)*30 + 153;
		var y = Math.sin(angle)*30 + 146;
		if(t==0)
			moveTo(x,y);
		else
			strokeTo(x,y);
	}
	for(var t=0;t<=1.05;t+=.05){
		var angle = Math.PI*2*t;
		var x = Math.cos(angle)*30 + 252;
		var y = Math.sin(angle)*30 + 170;
		if(t==0)
			moveTo(x,y);
		else
			strokeTo(x,y);
	}
	setMaterial(wood);
	//150,250,30,30

	addDynamic(new DynamicBall(new Vector(413,370), 10, new Vector(0,-100)));

	addFixed(new Flapper(new Vector(125,745),-.03,-.27,-.01));
	addFixed(new Flapper(new Vector(280,745),.03,.94,.68));

	addTrigger(new TriggerLineSegment(new Vector(150,830),new Vector(250,830),function(){
		build1();
	}));
}

build1();
