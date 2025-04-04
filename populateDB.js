const professions = [
    'Public Relations',
    'Psychologist',
    'Speech therapist',
    'Dental hygienist',
    'Computer Programmer',
    'Childcare Workers',
    'Hairdresser',
    'Occupational Therapist',
    'CEO',
    'Dietitians and Nutritionists',
    'Education',
    'Marketing Manager',  
    'Registered Nurse',
    'Surgeon',
    'Veterinarian',
    'Management Analyst',
    'Financial Analyst',
    'Physician',
    'IT Managers',
    'HomeMaker',
    'Other'
  ];
  

  professions.forEach(profession => {
    fetch('http://localhost:4049/createProfession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: profession })
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  });
  