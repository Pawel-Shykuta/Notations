import Swal from 'sweetalert2';


export const AscUser = async (text: string): Promise<boolean> => {
    const result = await Swal.fire({
        title: 'Вы уверены?',
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
    
      return result.isConfirmed; 
  }



