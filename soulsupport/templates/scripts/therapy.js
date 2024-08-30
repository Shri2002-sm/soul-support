document.getElementById('searchInput').addEventListener('input', filterTherapists);
document.getElementById('specialtyFilter').addEventListener('change', filterTherapists);
document.getElementById('locationFilter').addEventListener('change', filterTherapists);

function filterTherapists() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const specialtyFilter = document.getElementById('specialtyFilter').value;
  const locationFilter = document.getElementById('locationFilter').value;

  const cards = document.querySelectorAll('.therapist-card');

  cards.forEach(card => {
    const name = card.querySelector('h2').textContent.toLowerCase();
    const specialty = card.getAttribute('data-specialty');
    const location = card.getAttribute('data-location');

    const matchesSearch = name.includes(searchInput);
    const matchesSpecialty = specialtyFilter ? specialty === specialtyFilter : true;
    const matchesLocation = locationFilter ? location === locationFilter : true;

    if (matchesSearch && matchesSpecialty && matchesLocation) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
