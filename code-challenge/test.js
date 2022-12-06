document.addEventListener("DOMContentLoaded", () => {

    fetch("http://localhost:3000/characters")
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            showCharacter(item)
            renderOneCharacter(1)
        });
    })

    const characterBar = document.getElementById("character-bar");
    const characterInfo = document.querySelector("div.characterInfo")

    function showCharacter(characters) {
        const span = document.createElement("span")
        span.innerText = characters.name
        characterBar.append(span)

        span.addEventListener("click", function(){
            renderOneCharacter(characters.id)
        })
    }

    function renderOneCharacter(id) {
        fetch(`http://localhost:3000/characters/${id}`)
        .then(response => response.json())
        .then(character => {
            characterInfo.innerHTML = ''
            characterInfo.innerHTML = `
            <div id="detailed-info">
                <p id="name">${character.name}</p>
                <img id="image" src="${character.image}" alt="${character.name}"/>

                <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
                <form id="votes-form">
                    <input type="text" placeholder="Enter Votes" id="votes" name="votes" />
                    <input type="submit" value="Add Votes" />
                </form>
                <button id="reset-btn">Reset Votes</button>
            </div>
            <h4>Add New Character</h4>
            <form id="character-form">
                <div>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label for="image-url">Image URL</label>
                    <input type="text" id="image-url" name="image-url" />
                </div>
                <input type="submit" value="Add Character" />
            </form> 
        `
            const votesCount = characterInfo.querySelector("#vote-count")
            const resetVotes = characterInfo.querySelector("#reset-btn")
            const characterForm = characterInfo.querySelector("#character-form")

            const updateVotes = characterInfo.querySelector("#votes-form")
            updateVotes.addEventListener("submit", function(event) {
                event.preventDefault();
                const inputVotes = parseInt(updateVotes["votes"].value)
                if(inputVotes){
                    updateCharacterVotes(character, inputVotes, votesCount)
                }else {
                    alert("please insert a number")
                }
                updateVotes.reset()
            })

            resetVotes.addEventListener("click", function() {
                updateCharacterVotes(character, 0, votesCount)
            })

            characterForm.addEventListener("submit", function(event) {
                event.preventDefault()
                const data = {
                    name: characterForm["name"].value,
                    image: characterForm["image-url"].value,
                    votes: 0
                }
                addNewCharacter(data)
                characterForm.reset()
            })
        })
    }

    function updateCharacterVotes(character, voteInput, container) {

        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: character.id,
                name: character.name,
                image: character.image,
                votes: voteInput
            })
        })
        .then(response => response.json())
        .then(data => {
            container.innerText = data.votes
        })
    }

    function addNewCharacter(data) {
        fetch(`http://localhost:3000/characters/`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            showCharacter(data)
        })
    }
})