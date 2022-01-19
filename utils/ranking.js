export class Rankings {
	constructor(rankings) {
		this.timeframes = rankings.timeframes;
	}

	static async fetch() {
		const url = 'https://pow.co/node/v1/ranking-timeframes';

		let resp = await fetch(url, { method: 'GET' });

		let body = await resp.json();

		return new Rankings(body);
	}

	forContent(content) {
		return this.timeframes.map(timeframe => {
			var rankings = timeframe.rankings.filter(ranking => {
				return ranking.content === content;
			})[0];

			if (!rankings) {
				rankings = {
					content,
					rank: 0,
					difficulty: 0,
					value: 0
				};
			}

			return Object.assign(rankings, { timeframe: timeframe.name });
		});
	}

	estimateNewRank(content, timeframe, difficulty) {
		let contentRanking = this.forContent(content);

		let contentTimeframeRanking = contentRanking.filter(ranking => {
			return ranking.timeframe === timeframe;
		})[0];

		let newDifficulty = contentTimeframeRanking.difficulty + difficulty;

		let timeframeRankings = this.timeframes.filter(_timeframe => {
			return _timeframe.name === timeframe;
		})[0].rankings;

		var newRank = contentTimeframeRanking.rank;

		for (let ranking of timeframeRankings) {
			if (ranking.difficulty < newDifficulty) {
				newRank = ranking.rank;
				break;
			}
		}

		return newRank;
	}

	estimateDifficultyForRank(content, timeframe, ranking) {
		let contentRanking = this.forContent(content);

		let contentTimeframeDifficulty = contentRanking.filter(ranking => {
			return ranking.timeframe === timeframe;
		})[0].difficulty;

		let timeframeRankings = this.timeframes.filter(_timeframe => {
			return _timeframe.name === timeframe;
		})[0].rankings;

		var rankingDifficulty = timeframeRankings[ranking - 1].difficulty;

		return {
			current: rankingDifficulty,
			rank: ranking,
			required: rankingDifficulty - contentTimeframeDifficulty + 0.001
		};
	}
}
