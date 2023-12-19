import React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteEmployee, getAllEmployees } from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "../styles/HomePage.css";
import { getFilteredPaginatedEmployees } from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import Header from "./Header";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const { jwtToken } = auth || null;
  const componentPDF = useRef();
  const [showActions, setShowActions] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState("lastName");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();
  const inputRef = useRef();

  const {
    isSuccess,
    isLoading,
    isError,
    data: employees,
  } = useQuery({
    queryKey: ["employeesData", pageSize, pageNumber, sortBy, debouncedSearch],
    queryFn: () => {
      if (search?.trim() !== "") {
        return getFilteredPaginatedEmployees(
          jwtToken,
          search,
          pageSize,
          pageNumber,
          sortBy,
        );
      } else {
        return getAllEmployees(jwtToken, pageSize, pageNumber, sortBy);
      }
    },
    enabled: !!jwtToken,
  });

  useEffect(() => {
    inputRef?.current?.focus();
  }, [isSuccess]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^\w\dƏəХх]/g, "");
    setSearch(sanitizedValue);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (!employees.last) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPageNumber(0);
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: ({ id }) => deleteEmployee(id, jwtToken),
    onSuccess: () => {
      queryClient.invalidateQueries("employeesData");
    },
    onError: (error) => {
      if (error?.response?.status === 403)
        toast.error("Istifadəçini silməyə səlahiyyətiniz çatmır", {
          duration: 1000,
        });
    },
  });

  const handleUpdate = (employeeId) => {
    navigate(`/update/${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    deleteEmployeeMutation.mutate({ id: employeeId });
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => {
      setShowActions(true);
    },
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <Header
        search={search}
        handleSearchInputChange={handleSearchInputChange}
        setShowActions={setShowActions}
        generatePDF={generatePDF}
        employees={employees}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
      />
      {isLoading && <div>Loading...</div>}
      {!isLoading && !isError && (
        <table
          ref={componentPDF}
          className="max-h-60 w-full border-collapse overflow-y-scroll font-sans"
        >
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-2 py-1">Ad</th>
              <th className="border border-gray-400 px-2 py-1">Soyad</th>
              <th className="border border-gray-400 px-2 py-1">Rütbə</th>
              <th className="border border-gray-400 px-2 py-1">Vəzifə</th>
              <th className="border border-gray-400 px-2 py-1">Şöbə</th>
              {showActions && (
                <th className="w-1/12 border border-gray-400 px-2 py-1">
                  Əməliyyatlar
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {employees && employees?.content?.length > 0 ? (
              employees?.content?.map((employee, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-1 py-0">
                    {employee.firstName}
                  </td>
                  <td className="border border-gray-400 px-1 py-0">
                    {employee.lastName}
                  </td>
                  <td className="border border-gray-400 px-1 py-0">
                    {employee.rank.name}
                  </td>
                  <td className="border border-gray-400 px-1 py-0">
                    {employee.position.name}
                  </td>
                  <td className="border border-gray-400 px-1 py-0">
                    {employee.department.name}
                  </td>
                  {showActions && (
                    <td className="border border-gray-400 px-2 py-1">
                      <div className="flex items-center space-x-2">
                        <button
                          className="rounded bg-green-500 px-3 py-0.5 text-white transition duration-300 hover:bg-green-600"
                          onClick={() => handleUpdate(employee.id)}
                        >
                          Yenilə
                        </button>
                        <button
                          className="rounded bg-red-500 px-3 py-0.5 text-white transition duration-300 hover:bg-red-600"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-400 px-4 py-2" colSpan="6">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default HomePage;
