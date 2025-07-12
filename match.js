document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const filterSelect = document.getElementById('filterType');

  quizForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const q1 = quizForm.q1.value;
    const q2 = quizForm.q2.value;
    const q3 = quizForm.q3.value;

    if (!q1 || !q2 || !q3) {
      alert('Please answer all questions!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/careers');
      const data = await res.json();

      const match = data.find(item => item.type === q1);

    resultDiv.innerHTML = match
  ?`🔍 You might enjoy: <strong>${match.career}</strong>`
  :` ❌ No match found.`;

     resultDiv.classList.remove('hidden')
    }catch (error){
      console.error('Fetch error:', error);
      resultDiv.innerHTML = '⚠️ Error loading results.';
      resultDiv.classList.remove('hidden')
      resultDiv.classList.add('opacity-100');
      
      
    }
   
  });

  filterSelect.addEventListener('change', (e) => {
    loadCareers(e.target.value);
  });

  loadCareers(); // Load careers on page load
// });

// Load & Display Careers
async function loadCareers(filter = "all") {
  const res = await fetch('http://localhost:3000/careers');
  const data = await res.json();

  const careerList = document.getElementById('careerList');
  careerList.innerHTML = '';

  const filtered = filter === "all" ? data : data.filter(item => item.type === filter);

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 shadow rounded flex justify-between items-center';
    // update this line here:


    div.innerHTML = `
      <div>
        <strong>${item.career}</strong> <span class="text-sm text-gray-500">(${item.type})</span>
        <p class="text-sm text-gray-700">${item.description}</p>
      </div>
      <div class="space-x-2">
        <button onclick="editCareer(${item.id})" class="bg-blue-500 text-white px-2 py-1 rounded transition-all duration-300 hover:bg-blue-700"">Edit</button>
        <button onclick="deleteCareer(${item.id})" class="bg-red-500 text-white px-2 py-1 rounded transition-all duration-300 hover:bg-red-700">Delete</button>
      </div>
    `;
    careerList.appendChild(div);
  });
}

// Edit career
async function editCareer(id) {
  const newCareer = prompt('Enter new career title:');
  const newDesc = prompt('Enter new description:');
  if (!newCareer || !newDesc) return;

  await fetch(`http://localhost:3000/careers/${id},`) , {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ career: newCareer, description: newDesc })
   };

  loadCareers(document.getElementById('filterType').value);
}
editCareer()

// Delete career
async function deleteCareer(id) {
  await fetch(`http://localhost:3000/careers/${id},` ,{
    method: 'DELETE'
  
  });
    
  loadCareers(document.getElementById('filterType').value);
}
deleteCareer()
});