import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msvnggsygbgfudlryqsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdm5nZ3N5Z2JnZnVkbHJ5cXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0Mjg5MTgsImV4cCI6MjA4OTAwNDkxOH0.npB37w2I9VjO4fH09L0_SLnbl9KxTt9_Jq6Yh7iHT5c';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('1. Signing in with user account...');
  const email = 'bakomsGlobal@gmail.com';
  const password = 'testing2';
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log('User signed in:', userId);

  console.log('2. Inserting venture...');
  const { data: ventureData, error: ventureError } = await supabase.from('ventures').insert({
    entrepreneur_id: userId,
    name: 'Tech Innovators Nigeria',
    category: 'EdTech',
    description: 'We provide affordable tech solutions and educational tools for university students across Nigeria. We need funding to expand our hardware inventory.',
    funding_goal: 50000,
    interest_rate: 15,
    duration_days: 90,
    risk_level: 'low',
    status: 'listed',
    student_name: 'Test Student',
    university: 'University of Lagos'
  });

  if (ventureError) {
    console.error('Venture Error:', ventureError.message);
  } else {
    console.log('SUCCESS! Test venture created and listed on the marketplace.');
    console.log(`You can now log in as an investor and check for "Tech Innovators Nigeria".`);
  }
}

run();
