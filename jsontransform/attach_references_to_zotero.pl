#!/usr/bin/perl
use warnings; use strict; use utf8;
use open IO => ':encoding(UTF-8)', ':std';
use feature qw{ say }; 
use File::Slurper qw(read_text read_lines write_text);
use JSON qw( decode_json  encode_json to_json from_json);

&main;

sub main {
    my $c = from_json(read_text("correspondence.json"));
    my %cc;
    foreach (keys %{$c}) {
	$cc{"https://openalex.org/" . $_} = ${$c}{$_};
    };
    my $r = from_json(read_text("references.json"));
    my %o;
    my $zot = "zotero://select/groups/5072953/items/";
    foreach my $k (keys %{$r}) {
	foreach my $v (@{${$r}{$k}}) {
	    push @{$o{$cc{$k}}}, $zot.$cc{$v} if $cc{$v};
	};
    };
    foreach my $k (keys %o) {
	say "$zot/$k";
	my $str = join("<br>", @{${o}{$k}});
	say "\t$str";
	system("zotero-lib","--group","5072953","attach-note","--key","$zot$k","--notetext",$str,"--tags","_cites");
    };
};

