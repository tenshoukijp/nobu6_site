mkdir "dst";

# .ini�t�@�C����ǂݍ���ł��̂܂�Perl�Ƃ��Ď��s
open INI, "TsMovie2xConverter.ini";
my $SettingCmds = join '', <INI>;
eval $SettingCmds;
warn $@ if $@;
close INI;


my $report = "";

# �J�����g�t�H���_�̃S�~�폜
for my $png (<*.png>) {
	unlink $png;
}
# �o�̓t�H���_�̃S�~�폜
for my $file (<dst/*.*>) {
	unlink $file;
}

for my $movie ( glob("*".$extension) ) {
	$movie_name = $movie ;
	my ($movie_base) = $movie_name =~ /([^\\]+)\.\w+$/;

	# �Y�����[�r�[��FPS�𓾂�
	my $cmd = `"$ffprobe" -hide_banner $movie_name 2>&1`;
	my ($fps) = $cmd =~ /, ([0-9\.]+) fps,/m;

	# ���[�r�[��A��png��
	print `"$ffmpeg" -i "$movie_name" -f image2 -vcodec png "$movie_base\_%04d.png"`;

	my $movie_sound = "dst/$movie_base\.wav";
	# ���[�r�[���特��codec�Ȃǂ����̂܂܂�
	print `"$ffmpeg" -vn -i "$movie_name" -acodec copy "$movie_sound"`;

	
	# �A�Ԃ̉摜���e�X�Q�{�̏c���T�C�Y�Ƃ���B
	for my $png (glob("$movie_base\_*.png")) {
		my $png_2x = $movie_base . "_times";

		# waifu2x �łQ�{�ɂ���B���̖��O��_2x�Ƃ����t�@�C�����ŏo��
		print "$png" . "\n   ��";
		print `$waifu2x -i "$png" -m noise_scale --scale_ratio 2 --noise_level 1 --process $process -o "$png_2x.png"`;

		# ���̃t�@�C�����ւƏ㏑��
		unlink $png;
		rename "$png_2x.png", $png;
	}

	my $movie_base_2x = "dst/$movie_base\_2x" . $extension;

	# ���X���X�ō쐬�B
	print `"$ffmpeg" -f image2 -r $fps -i "$movie_base\_%04d.png" -r $fps -an -vcodec libx264 -pix_fmt yuv420p -crf 0 "$movie_base_2x"`;

	# ����Ɖ����̍���
	print `"$ffmpeg" -i "$movie_base_2x" -i "$movie_sound" -acodec copy -vcodec copy "dst/$movie_base$extension"`;

	# �ꎞ�t�@�C���̍폜(�����Ɖf��)
	unlink $movie_base_2x;
	unlink $movie_sound;

	# �ꎞ�t�@�C���̍폜(png)
	for my $png (<*.png>) {
		unlink $png;
	}

}