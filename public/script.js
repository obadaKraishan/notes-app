document.addEventListener('DOMContentLoaded', () => {
    fetchNotes();
  
    document.getElementById('noteForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const noteInput = document.getElementById('noteInput').value;
      addNote(noteInput);
      document.getElementById('noteInput').value = '';
    });
  
    document.getElementById('searchInput').addEventListener('input', function(event) {
      const query = event.target.value.toLowerCase();
      const notes = document.querySelectorAll('#noteList .list-group-item');
      notes.forEach(note => {
        const text = note.querySelector('.note-text').innerText.toLowerCase();
        if (text.includes(query)) {
          note.style.display = '';
        } else {
          note.style.display = 'none';
        }
      });
    });
  });
  
  function fetchNotes() {
    fetch('/notes')
      .then(response => response.json())
      .then(data => {
        const noteList = document.getElementById('noteList');
        noteList.innerHTML = '';
        data.forEach((note, index) => {
          const li = document.createElement('li');
          li.className = `list-group-item d-flex justify-content-between align-items-center ${note.important ? 'important' : ''}`;
          li.innerHTML = `
            <span class="note-text">${note.text}</span>
            <div>
              <button class="btn btn-warning btn-sm mr-2" onclick="editNotePrompt(${index})">Edit</button>
              <button class="btn btn-secondary btn-sm mr-2" onclick="toggleImportant(${index})">${note.important ? 'Unmark' : 'Mark'} Important</button>
              <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">Delete</button>
            </div>
          `;
          noteList.appendChild(li);
        });
      });
  }
  
  function addNote(note) {
    fetch('/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note })
    })
    .then(response => response.json())
    .then(data => {
      fetchNotes();
    });
  }
  
  function editNotePrompt(index) {
    const newText = prompt('Edit your note:');
    if (newText !== null && newText.trim() !== '') {
      editNote(index, newText);
    }
  }
  
  function editNote(index, note) {
    fetch(`/notes/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note })
    })
    .then(response => response.json())
    .then(data => {
      fetchNotes();
    });
  }
  
  function toggleImportant(index) {
    fetch('/notes')
      .then(response => response.json())
      .then(data => {
        const important = !data[index].important;
        fetch(`/notes/${index}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ important })
        })
        .then(response => response.json())
        .then(data => {
          fetchNotes();
        });
      });
  }
  
  function deleteNote(index) {
    fetch(`/notes/${index}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      fetchNotes();
    });
  }
  