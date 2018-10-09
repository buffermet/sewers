<?php

// Set variables

	$a = "messages";
	$b = "readstamps";
	$c = 120;
	$d = "sp";
	$e = "sg";
	$f = "ip";
	$g = "ig";
	$h = file_get_contents("php://input");
	$i = explode("\n", $h);
	if ( isset($i[0]) && isset($i[1]) ) {
		$j = $i[0];
		$k = $i[1];
	}
	$l = implode( "\n", array_slice( explode("\n", $h), 2 ) );
	$l = rtrim($l, "\n");

// Debug packet

	// ob_start();
	// var_dump("\n========PACKET========\n" . $j . "\n" . $k . "\n" . $l . "\n======================\n");
	// error_log( ob_get_clean(), 4 );

// Set functions

	// function obf_func_randString() {
	// 	$m = "abcdefghijklmnopqrstuvwxyz";
	// 	$n = strlen($m);
	// 	$o = "";
	// 	while ( strlen($o) < 16 ) {
	// 		$o .= $m[rand(0, $n - 1)];
	// 	}
	// 	return $o;
	// }

	function s($p) {
		return array_diff( scandir($p), array(".", "..") );
	}

	function y($p, $l) {
		$q = 0;
		$r = s($p);
		foreach ($r as $t) {
			$t > $q ? $q = $t : "";
		}
		$u = $q + 1;
		$v = $p . "/" . $u;
		$w = fopen($v, "w") or die("Cannot create file:  " . $v);
		fwrite($w, $l);
		fclose($w);
	}

// Parse packet

	if ( !is_dir("./" . $a) ) {
		mkdir("./" . $a);
	}

	if ( !is_dir("./" . $b) ) {
		mkdir("./" . $b);
	}

	// Sewers GET request
	if ( $j == $e && $k != "nil" ) {
		if ( is_dir("./" . $a . "/" . $k) ) {
			if ($l == "nil") {
				echo join( ",", s("./" . $a . "/" . $k) );
			} else {
				if ( is_file("./" . $a . "/" . $k . "/" . $l) ) {
					echo file_get_contents("./" . $a . "/" . $k . "/" . $l);
					unlink("./" . $a . "/" . $k . "/" . $l);
				} else {
					http_response_code(404);
					die();
				}
			}
		} else {
			http_response_code(404);
			die();
		}
	} elseif ( $j == $e && $k == "nil" ) {
		echo join( ",", s("./" . $a) );
	}

	// Sewers POST request
	if ( $j == $d && isset($k) ) {
		if ( !is_dir("./" . $b . "/" . $k) ) {
			mkdir("./" . $b . "/" . $k);
		}
		y("./" . $b . "/" . $k, $l);
	}

	// Interpreter GET request
	if ($j == $g && $k != "nil" ) {
		if ( !is_dir("./" . $a . "/" . $k) ) {
			mkdir("./" . $a . "/" . $k);
		}
		if ( !is_dir("./" . $b . "/" . $k) ) {
			mkdir("./" . $b . "/" . $k);
		}
		if ($l == "nil") {
			$x = s("./" . $b . "/" . $k);
			if ( count($x) > 0 ) {
				echo join(",", $x);
			} else {
				http_response_code(404);
				die();
			}
		} else {
			if ( is_file("./" . $b . "/" . $k . "/" . $l) ) {
				echo file_get_contents("./" . $b . "/" . $k . "/" . $l);
				unlink("./" . $b . "/" . $k . "/" . $l);
			} else {
				http_response_code(404);
				die();
			}
		}
	}

	// Interpreter POST request
	if ($j == $f && isset($k) ) {
		if ( !is_dir("./" . $a . "/" . $k) ) {
			mkdir("./" . $a . "/" . $k);
		}
		if ( !is_dir("./" . $b . "/" . $k) ) {
			mkdir("./" . $b . "/" . $k);
		}
		y("./" . $a . "/" . $k, $l);
	}

?>