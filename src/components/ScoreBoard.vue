<template>
  <div className="scoreBoard">
    <div className="high-scores">
      <p>High Scores</p>
    </div>
    <table>
      <thead>
        <tr>
          <td className="tdhead">Rank</td>
          <td className="tdhead">Name</td>
          <td className="tdhead">Score</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, index) in scores.documents" v-bind:key="{index}">
          <td className="tdbody">{{index + 1}}</td>
          <td className="tdbody">{{val.player}}</td>
          <td className="tdbody">{{val.score}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from "../api";
export default {
  data() {
    return {
      scores: [],
      unsubscribe: null
    };
  },
  methods: {
    async getScores() {
      const scores = await api.database.listDocuments(
        process.env.VUE_APP_APPWRITE_COLLECTIONS,
        [],
        10,
        0,
        "",
        "",
        ["score"],
        ["DESC"]
      );

      this.scores = scores;
    },
  },
  watch: {
      scores() {
        this.unsubscribe = api.subscribe([process.env.VUE_APP_APPWRITE_COLLECTIONS], (data) => {
            if (data.event === 'database.documents.create') {
                
                const newScores = [...this.scores];
                const newScore = data.payload;
                newScores.push(newScore);
                newScores.sort((a, b) => b.score - a.score);
                newScores.splice(10, newScores.length - 10);
                this.scores = newScores;

            } else if (data.event === 'database.documents.update') {
                this.getScores();
            }
        })
      }
  },
  mounted() {
    this.getScores();
  },
  beforeUnmount() {
    this.unsubscribe();
  }
};
</script>

<style>
.scoreBoard{
    max-width: 450px;
    height: 500px;
    background-color: rgba(7, 7, 7, 0.671);
    margin: 40px 20px;
    outline: 4px solid #feeb2c;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.high-scores{
    padding: 20px 10px;
}

.high-scores p{
    font-size: 22px;
    color: #ff074e;
    font-family: 'Press Start 2P', cursive;
}

table{
    width: 450px;
    border-collapse: separate;
    border-spacing: 0 1em;
}

thead{
    color: rgb(254, 235, 44);
}

.tdhead{
    font-family: 'Press Start 2P', cursive;
    text-align: center;
}

thead{
    height: 40px;
    padding-bottom: 20px;
}

.tdbody{
    color: #0058f8;
    font-family: 'Press Start 2P', cursive;
    text-align: center;
}

/*--------------- Trying to make it responsible for smaller screen :) ------------------*/
@media only screen and (max-height: 790px) {
    .scoreBoard{
        height: 400px;
        width: 400px;
        padding: 5px;
    }
    table{
        width: 400px;
    }
    .tdbody{
        font-size: 12px;
    }
    .high-scores{
        padding: 10px 10px;
    }
}

@media only screen and (max-height: 600px){
    .scoreBoard{
        height: 350px;
        max-width: 350px;
    }
    table{
        width: 350px;
        border-spacing: 0 12px;
    }
    .tdhead{
        font-size: 14px;
    }
    .tdbody{
        font-size: 12px;
    }
    .high-scores{
        padding: 5px;
    }
}

@media only screen and (max-width: 450px){
    .scoreBoard{
        height: 400px;
        width: 300px;
        /* padding: 5px; */
    }
    table{
        width: 300px;
    }
    .tdhead{
        font-size: 14px;
    }
    .tdbody{
        font-size: 12px;
    }
    .high-scores{
        padding: 5px;
    }
}
</style>