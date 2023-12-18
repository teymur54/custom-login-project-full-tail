import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { createEmployee, getAllDepartments, getAllPositions, getAllRanks } from '../api/axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomStyle.css'

const PostEmployee = () => {
  const {auth} = useAuth();
  const { jwtToken } = auth || null; 
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(['']);
  const [selectedRank, setSelectedRank] = useState(['']);
  const [selectedPosition, setSelectedPosition] = useState(['']);
  const [error, setError] = useState(null);

  const {data: departments} = useQuery({
    queryKey:['departments'],
    queryFn: () => getAllDepartments(jwtToken),
    enabled: !!jwtToken,
  });

  const {data: positions} = useQuery({
    queryKey:['positions'],
    queryFn: () => getAllPositions(jwtToken),
    enabled: !!jwtToken,
  });

  const {data: ranks} = useQuery({
    queryKey:['ranks'],
    queryFn: () => getAllRanks(jwtToken),
    enabled: !!jwtToken,
  })

  const departmentOptions = departments?.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const positionOptions = positions?.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  const rankOptions = ranks?.map((rank) => ({
    value: rank.id,
    label: rank.name,
  }));

  const createEmployeeMutation = useMutation({
    mutationFn:(employeeData) => createEmployee(employeeData,jwtToken),
    onSuccess:() => {
      toast.success('istifadəçi uğurla əlavə olundu',{duration: 1000})
      navigate('/')
    },
    onError: (error) => {
      setError(error);
    },
  })

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setSelectedDepartment('');
    setSelectedRank('');
    setSelectedPosition('');
   };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const employeeData = {
      firstName,
      lastName,
      department: {
        id: selectedDepartment,
      },
      position: {
        id: selectedPosition,
      },
      rank: {
        id: selectedRank,
      },
    };

    createEmployeeMutation.mutate(employeeData);

    resetForm();
  };

  return (
<div className="max-w-md mx-auto mt-10 p-4 border border-gray-400 rounded-lg bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label>
          <span className="font-bold">First name:</span>
          <input
            className="input-style"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="font-bold">Last name:</span>
          <input
            className="input-style"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="font-bold">Department:</span>
          <Select
            className="input-style"
            value={departmentOptions?.find((dep) => dep.value === selectedDepartment)}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departmentOptions}
            required
          />
        </label>
        <label>
          <span className="font-bold">Rank:</span>
          <Select
            className="input-style"
            value={rankOptions?.find((rank) => rank.value === selectedRank)}
            onChange={(e) => setSelectedRank(e.value)}
            options={rankOptions}
            required
          />
        </label>
        <label>
          <span className="font-bold">Position:</span>
          <Select
            className="input-style"
            value={positionOptions?.find((position) => position.value === selectedPosition)}
            onChange={(e) => setSelectedPosition(e.value)}
            options={positionOptions}
            required
          />
        </label>
        <button className="w-full px-4 py-2 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostEmployee;