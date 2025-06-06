import React, { useEffect, useState } from "react";
import style from './LoockFileStyle.module.css';
import Header from '../../../components/Header/Header';
import { infoUser, ChangeValue, dellItem } from '../../../services/loadServices/loadInfoUser';

const Previe = () => {
  const [dataInfo, setDataInfo] = useState<any[]>([]);
  const [filterInput, setFilterInput] = useState<string>('');
  const [filterImportance, setFilterImportance] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [changeInputs, setChangeInputs] = useState({
    name: '',
    date: '',
    text: '',
    importance: 'low',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChangeInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const takeInfo = async () => {
      const info = await infoUser();
      if (info?.fields?.lists?.arrayValue?.values) {
        setDataInfo(info.fields.lists.arrayValue.values || []);
      }
    };
    takeInfo();
  }, []);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    const item = dataInfo[index].mapValue.fields;
    setChangeInputs({
      name: item.name.stringValue || "",
      date: item.date.stringValue || "",
      text: item.text.stringValue || "",
      importance: item.importance.stringValue || "low",
    });
  };

  const SendChangeItem = async (index: number) => {
    const updatedItem = {
      mapValue: {
        fields: {
          name: { stringValue: changeInputs.name },
          date: { stringValue: changeInputs.date },
          text: { stringValue: changeInputs.text },
          importance: { stringValue: changeInputs.importance },
        },
      },
    };

    try {
      await ChangeValue(updatedItem, index);

      setDataInfo((prev) => {
        const updatedData = [...prev];
        updatedData[index] = updatedItem;
        return updatedData;
      });

      setEditingIndex(null);
      setChangeInputs({ name: "", date: "", text: "", importance: "low" });

    } catch (error) {
      console.error("Ошибка при изменении данных:", error);
    }
  };
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = dataInfo.filter((item) => {
    const name = item?.mapValue?.fields?.name?.stringValue?.toLowerCase() || "";
    const importance = item?.mapValue?.fields?.importance?.stringValue?.toLowerCase() || "";

    const nameMatches = name.includes(filterInput.toLowerCase());
    const importanceMatches = filterImportance ? importance === filterImportance : true;

    return nameMatches && importanceMatches;
  })
  .sort((a, b) => {
    const dateA = new Date(a.mapValue.fields.date.stringValue).getTime();
    const dateB = new Date(b.mapValue.fields.date.stringValue).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const DellItem = async (index: number) => {
    try {
      await dellItem(index);
      setDataInfo((prev) => {
        const updatedData = [...prev];
        updatedData.splice(index, 1);
        return updatedData;
      });
      alert('file dell')
      setEditingIndex(null)
    } catch (error) {
      console.error("Ошибка при удалении элемента:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; 
  };

  const todayDate: Date = new Date();
  const todayDateObject = new Date(todayDate);




  return (
    <>
      <Header />
      <div className={style.filters}>
        <input
          type="text"
          className={style.filtersInputText}
          placeholder="Input name or date"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <select value={filterImportance} onChange={(e) => setFilterImportance(e.target.value)} className={style.selected}>
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className={style.selected}>
          <option value="asc">Sort by Date ↑</option>
          <option value="desc">Sort by Date ↓</option>
        </select>

      </div>
      <div className={style.previewContainer}>
        <div className={style.previewContent}>
          <h1 className={style.previewTitle}>All Lists</h1>
          <div className={style.previewListContainer}>
            {filteredData.length > 0 ? (
              <div className={style.previewList}>
                {filteredData.map((item, index) => {

                  const itemDateString = item.mapValue.fields.date.stringValue;
                  const formattedItemDate = formatDate(itemDateString); 

                  const itemDate = new Date(itemDateString);
                  const timeDifference = itemDate.getTime() - todayDateObject.getTime(); 
                  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)+1);
                  
                  return (
                    <div key={index} className={style.previewListItem}>
                      <h1 className={style.previewDayLeft}  >left days: <span style={daysDifference <= 3 ? {color:"red"} :{color:"green"}}>{daysDifference}</span></h1>
                      <h1 className={style.previewItemTitle}> {item.mapValue.fields.name.stringValue}</h1>
                      <h2 className={style.previewItemText}>{formattedItemDate}</h2> 
                      <h2 className={style.previewItemText}> {item.mapValue.fields.text.stringValue}</h2>
                      <h3 className={style.previewItemText}>Importance: {item.mapValue.fields.importance.stringValue}</h3>
                      <button onClick={() => handleEditClick(index)}>Change</button>

                      {editingIndex === index && (
                        <div className={style.ChangeBlock}>
                          <h2>Change value</h2>
                          <label htmlFor="name">Name</label>
                          <input type="text" name="name" placeholder="new name" value={changeInputs.name} onChange={handleInputChange} />
                          <label htmlFor="date">Date</label>
                          <input type="date" name="date" placeholder="new date" value={changeInputs.date} onChange={handleInputChange} />
                          <label htmlFor="text">Text</label>
                          <textarea name="text" placeholder="new text" value={changeInputs.text} onChange={handleInputChange}></textarea>
                          <label htmlFor="importance">Importance</label>
                          <select name="importance" value={changeInputs.importance} onChange={handleInputChange}>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                          <button onClick={() => SendChangeItem(index)}>Send</button>
                          <button onClick={() => setEditingIndex(null)}>Cancel</button>
                          <button onClick={() => DellItem(index)}>Delete</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <h1 className={style.previewNoInfo}>No Info</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Previe;
