This is the project page for TwitchTetris, the game deployed at http://TwitchTetris.com

The aim of this implementation is to create a clean implementation of Tetris following the <a href='http://tetris.wikia.com/wiki/Tetris_Guideline'>Tetris Guideline</a> set out by The Tetris Company. Where the guidelines leave room for variation, this implementation will likely lean towards the implementation by <a href='http://tetrisfriends.com'>Tetris Friends</a> marathon mode, but that is not a set-in-stone rule right now.

As an avid Tetris player, I was shocked to find that there were no web-based implementations of Tetris that met my expectations of the game and did not have any dependencies on unreliable platforms. In particular, Flash-based games have a noticeable difference in input latency between different platforms when playing fast (>80 pieces per minute).

This implementation will be written completely in Javascript, with dependencies only on Html5 libraries. This should create a much more consistent experience between modern browsers and operating systems in comparison to Flash or Java based games.