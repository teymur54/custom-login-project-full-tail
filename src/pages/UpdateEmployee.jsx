import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllDepartments, getAllPositions, getAllRanks, updateEmployee, getEmployeeById } from '../api/axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

const UpdateEmployee = () => {
  const { id } = useParams();
  const {auth} = useAuth();
  const { jwtToken } = auth || null; 
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(['']);
  const [selectedRank, setSelectedRank] = useState(['']);
  const [selectedPosition, setSelectedPosition] = useState(['']);

  const { data: employeeData } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id, jwtToken),
    enabled: !!jwtToken,
  });

  useEffect(() => {
    if (employeeData) {
      setFirstName(employeeData.firstName || '');
      setLastName(employeeData.lastName || '');
      setSelectedDepartment(employeeData.department.id || '');
      setSelectedPosition(employeeData.position.id || '');
      setSelectedRank(employeeData.rank.id || '');
    }
  }, [employeeData]);


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

  const updateEmployeeMutation = useMutation({
    mutationFn:(employeeData) => updateEmployee(id,employeeData,jwtToken),
    onSuccess:() => {
      queryClient.invalidateQueries('employeesData');
      toast.success('istifadəçi haqqında informasiya uğurla yeniləndi',{duration: 1000})
      navigate('/')
    }
  })

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

    updateEmployeeMutation.mutate(employeeData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-400 rounded-lg bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label className="mb-2">
          <span className="font-bold">First name:</span>
          <input
            className="input-style"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label className="mb-2">
          <span className="font-bold">Last name:</span>
          <input
            className="input-style"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label className="mb-2">
          <span className="font-bold">Department:</span>
          <Select
            className="input-style"
            value={departmentOptions?.find((dep) => dep.value === selectedDepartment)}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departmentOptions}
          />
        </label>
        <label className="mb-2">
          <span className="font-bold">Rank:</span>
          <Select
            className="input-style"
            value={rankOptions?.find((rank) => rank.value === selectedRank)}
            onChange={(e) => setSelectedRank(e.value)}
            options={rankOptions}
          />
        </label>
        <label className="mb-2">
          <span className="font-bold">Position:</span>
          <Select
            className="input-style"
            value={positionOptions?.find((position) => position.value === selectedPosition)}
            onChange={(e) => setSelectedPosition(e.value)}
            options={positionOptions}
          />
        </label>
        <button className="bg-nazirlik w-full py-2 text-white rounded-lg hover:bg-blue-900" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default UpdateEmployee
