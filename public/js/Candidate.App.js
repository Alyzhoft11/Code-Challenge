const app = angular.module("Candidate.App", []);

app.component("itmRoot", {
  controller: class {
    constructor() {
      this.candidates = [
        { name: "Puppies", votes: 10 },
        { name: "Kittens", votes: 12 },
        { name: "Gerbils", votes: 7 }
      ];
      this.getPercentage();
      this.sort();
    }

    sort() {
      this.candidates.sort((a, b) =>
        a.votes > b.votes ? -1 : b.votes > a.votes ? 1 : 0
      );
    }

    getPercentage() {
      let totalVotes = 0;

      this.candidates.forEach(e => {
        totalVotes += e.votes;
      });

      this.candidates.forEach(e => {
        e.percent = Math.round((e.votes / totalVotes) * 100);
      });
    }

    onVote(candidate) {
      console.log("Pressed");
      let candidateName = candidate.name;

      this.candidates.forEach(e => {
        if (e.name == candidateName) {
          e.votes++;
        }
      });
      this.getPercentage();
      this.sort();
    }

    onAddCandidate(candidate) {
      let newCandidate = candidate.name;
      let add = true;
      if (
        newCandidate != "" &&
        newCandidate != undefined &&
        newCandidate != null
      ) {
        for (let c of this.candidates) {
          if (c.name.toLowerCase() == newCandidate.toLowerCase()) {
            add = false;
            alert(`Candidate ${newCandidate} has already been entered`);
            break;
          }
        }
        if (add) {
          this.candidates.push({ name: newCandidate, votes: 0 });
        }
      } else {
        alert("You must enter a Candidate Name");
      }
      this.sort();
      this.getPercentage();
    }

    onRemoveCandidate(candidate) {
      let removeCandidate = candidate.name;
      let candidates = this.candidates;
      for (let i = 0; i < candidates.length; i++) {
        if (candidates[i].name == removeCandidate) {
          candidates.splice(i, 1);
        }
      }

      this.sort();
      this.getPercentage();
    }
  },
  template: `

    <div class=container>
      <h1>Which candidate brings the most joy?</h1>
          
      <itm-management 
        candidates="$ctrl.candidates"
        on-add="$ctrl.onAddCandidate($candidate)"
        on-remove="$ctrl.onRemoveCandidate($candidate)">
      </itm-management>

      <itm-results 
        candidates="$ctrl.candidates"
        on-vote="$ctrl.onVote($candidate)"
        on-remove="$ctrl.onRemoveCandidate($candidate)">
      </itm-results>
    </div>
    `
});

app.component("itmManagement", {
  bindings: {
    candidates: "<",
    onAdd: "&",
    onRemove: "&"
  },
  controller: class {
    constructor() {
      this.newCandidate = {
        name: ""
      };
    }

    submitCandidate(candidate) {
      this.onAdd({ $candidate: candidate });
      this.newCandidate.name = "";
    }
  },
  template: `
      <h3 class="mt-5">Add New Candidate</h3>
      <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>
        <div class="form-group row">
          <div class="input-group">
            <input type="text" id="newCandidateName" class="form-control" placeholder="Candidate Name" ng-model="$ctrl.newCandidate.name" required>
            <div class="input-box-append">
              <button class="btn btn-primary" type="submit">Add</button>
            </div>
          </div>
        </div>
      </form>
    `
});

app.component("itmResults", {
  bindings: {
    candidates: "<",
    onVote: "&",
    onRemove: "&"
  },
  controller: class {
    removeCandidate(candidate) {
      this.onRemove({ $candidate: candidate });
    }
  },
  template: `
        <div class="card-columns p-3">
          <div ng-repeat="candidate in $ctrl.candidates" class="card border-primary mb-3" style="max-width: 20rem;">
            <div class="card-header text-center"><h1>{{ candidate.name }}</h1>
            <span class="remove" ng-click="$ctrl.removeCandidate(candidate)">X</span>
            </div>
            <div class="card-body">
              <h4 class="inline">Votes: {{candidate.votes}}</h4>
              <h4 class="inline">Percent: {{ candidate.percent }}%</h4>
              <div class="text-center mt-2">
              <button type="button"
                class="btn btn-success btn-lg"
                ng-click="$ctrl.onVote({ $candidate: candidate })">
                <span>Vote</span>
              </button>
              </div>
            </div>
          </div>
        </div>
    `
});
