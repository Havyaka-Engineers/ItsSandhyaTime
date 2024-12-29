import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import BackgroundPattern3 from '../assets/Background_Pattern_3.svg';
import sandhyaTimeLogo from '../assets/SandhyaTime-Logo.svg';

function RegisteredUsers() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUserCount(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="flex flex-col justify-between w-full h-full max-w-lg relative bg-[#532C16] bg-center bg-cover"
        style={{ backgroundImage: `linear-gradient(rgba(83, 44, 22, 0.8),rgba(83, 44, 22, 0.8)),url(${BackgroundPattern3})` }}
      >
        <div className="flex justify-center items-center mt-10 relative z-10">
          <img src={sandhyaTimeLogo} alt="Sandhya Time Logo" className="w-30 h-auto" />
        </div>
        <div className="flex justify-center items-center mb-20 relative z-10">
          {userCount !== null ? (
            <p className="text-white text-2xl">Total registered users: {userCount}</p>
          ) : (
            <p className="text-white text-2xl">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisteredUsers;
