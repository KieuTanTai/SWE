import bcrypt from 'bcrypt';

const password = 'password123';
const saltRounds = 10;

(async () => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Hash:', hash);
  } catch (err) {
    console.error('Error:', err);
  }
})();
