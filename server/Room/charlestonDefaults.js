//We need to create a new array every time this is called - the
//startGame code destroys the array while processing (it becomes an empty array)
module.exports = {
	americanMahjong: function() {
		return [
			[
				{
					direction: "right",
				},
				{
					direction: "across",
				},
				{
					direction: "left",
					blind: true
				}
			],
			[
				{
					direction: "left",
					allAgree: true
				},
				{
					direction: "across",
				},
				{
					direction: "right",
					blind: true
				}
			],
			[
				{
					direction: "across",
					blind: true
				}
			]
		]
	},
	chineseMahjong: function() {
		return [
			[
				{
					direction: "right",
				},
				{
					direction: "across",
				},
				{
					direction: "left",
					//TODO: Allow Blind?
				}
			]
		]
	}
}
