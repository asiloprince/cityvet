import { useState } from 'react';
function TeamRole() {
    const Roles = [
        {
            ID: 1,
            Name: "Jerald Banalan",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Staff",
        },
        {
            ID: 2,
            Name: "Maher Calingasan",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "User"
        },
        {
            ID: 3,
            Name: "Prince Asilo",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Admin"
        },
        {
            ID: 4,
            Name: "Prince Pogi",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Admin"
        },
        {
            ID: 5,
            Name: "Prince Gwapo",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Admin"
        },
        {
            ID: 6,
            Name: "Prince Handsome",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Admin"
        },
        {
            ID: 7,
            Name: "Prince Awesome",
            Age: 10,
            PhoneNumber: "090910102022",
            Email: "try@yahoo.com",
            ActiveLevel: "Admin"
        },
    ];

    const [state, setState] =useState(false);
    const toggle=()=>{
        setState(!state);
    }

  return (
    <div className='m-5'>
        <h1 className='text-xl font-bold m-4'>Roles</h1>
        <div className='shadow-md rounded-lg border-y-4 border-y-cyan-500 '> 
            <table className='table-auto w-full '>
                <thead className='h-10 border-b text-gray-500'>
                    <tr>
                        <th className='text-start p-4'>ID</th>
                        <th className='text-start p-4'>Name</th>
                        <th className='text-start p-4'>Age</th>
                        <th className='text-start p-4'>Phone Number</th>
                        <th className='text-start p-4'>Email</th>
                        <th className='text-start p-4'>Active Level</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Roles.map((roles, i) =>(
                            <tr key={i} className='hover:bg-gray-100 border-b font-semibold text-xs text-gray-500'>
                                <td className='p-3 text-left'><p className='bg-cyan-100 text-cyan-500 text-center rounded-md font-bold'>{roles.ID}</p></td>
                                <td className='p-3 text-left border-l'>{roles.Name}</td>
                                <td className='p-3 text-left'>{roles.Age}</td>
                                <td className='p-3 text-left'>{roles.PhoneNumber}</td>
                                <td className='p-3 text-left border-r'>{roles.Email}</td>
                                <td className='p-3 text-left'><button onClick={toggle} className='border-r-cyan-500 w-full bg-cyan-100 rounded-lg text-cyan-500 p-2'>{roles.ActiveLevel}</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>       
    </div>
  )

}

export default TeamRole;
