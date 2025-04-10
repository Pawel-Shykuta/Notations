import React, { useState } from "react";
import style from './AddFileStyle.module.css';
import Header from "../../../components/Header/Header";
import { addEvent } from '../../../services/loadServices/loadInfoUser';

const AddFile = () => {
    const [dataInfo, setDataInfo] = useState({
        name: '',
        date: '',
        text: '',
        importance: 'low', 
    });

    const changeInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDataInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addEvent(dataInfo);
            console.log('Data submitted:', dataInfo); 


            setDataInfo({
                name: '',
                date: '',
                text: '',
                importance: 'low',
            });

            alert('Event added successfully!');
        } catch (error) {
            console.log('Error adding event:', error);
            alert('Failed to add event!');
        }
    };

    return (
        <div>
            <Header />
            <div className={style.formContainer}>
                <form onSubmit={handleSubmit}>
                    <h1>Add Event</h1>

                    <div className={style.inputGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={dataInfo.name}
                            onChange={changeInfo}
                            placeholder="Event name"
                            required
                        />
                    </div>

                    <div className={style.inputGroup}>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={dataInfo.date}
                            onChange={changeInfo}
                            required
                        />
                    </div>

                    <div className={style.inputGroup}>
                        <label htmlFor="text">Text</label>
                        <textarea
                            name="text"
                            value={dataInfo.text}
                            onChange={changeInfo}
                            placeholder="Event description"
                            required
                        />
                    </div>

                    <div className={style.inputGroup}>
                        <label htmlFor="importance">Importance</label>
                        <select
                            name="importance"
                            value={dataInfo.importance}
                            onChange={changeInfo}
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddFile;
