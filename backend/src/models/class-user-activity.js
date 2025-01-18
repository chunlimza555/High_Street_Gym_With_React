import { db_conn } from "../database.js";


export function newClassUserActivity(
        
        class_id,
        class_datetime, 
        class_location_id, 
        class_activity_id, 
        class_trainer_user_id,

        
        
        user_firstname, 
        user_lastname, 
        user_address,

        
        activity_name, 
        activity_description, 
        activity_duration,

        
        location_name
) 
    {
    return {
        
        class_id,
        class_datetime, 
        class_location_id, 
        class_activity_id, 
        class_trainer_user_id,

        
        
        user_firstname, 
        user_lastname, 
        user_address,

        
        activity_name, 
        activity_description, 
        activity_duration,

        
        location_name
    }
}


export function getAll() {
  return db_conn.query(
      `SELECT * FROM classes 
      INNER JOIN location ON classes.class_location_id = location.location_id
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN users ON classes.class_trainer_user_id = users.user_id
      WHERE class_datetime >= NOW()
      `
  )
      .then(([queryResult]) => {
          // convert each result into a model object
          return queryResult.map(
                  result => newClassUserActivity(
                  result.class_id,
                  result.class_datetime, 
                  result.class_location_id, 
                  result.class_activity_id, 
                  result.class_trainer_user_id,
          
                  
                  
                  result.user_firstname, 
                  result.user_lastname, 
                  result.user_address,
          
                  
                  result.activity_name, 
                  result.activity_description, 
                  result.activity_duration,
          
                  
                  result.location_name
              )
          )
      })
}

            
// test //

// getAll().then((classes) => {
//     console.log(classes)
// })

export function getByClassId(class_id) {
  return db_conn.query(
      `SELECT * FROM classes 
      INNER JOIN location ON classes.class_location_id = location.location_id
      INNER JOIN activities ON classes.class_activity_id = activities.activity_id
      INNER JOIN users ON classes.class_trainer_user_id = users.user_id
      WHERE classes.class_id = ?
      
      
      `, [class_id]
  )
  .then(([queryResult]) => {
      if (queryResult.length > 0) {
          // Convert each result into a model object
          return queryResult.map(
                result => newClassUserActivity(
                  result.class_id,
                  result.class_datetime, 
                  result.class_location_id, 
                  result.class_activity_id, 
                  result.class_trainer_user_id,
          
                  
                  
                  result.user_firstname, 
                  result.user_lastname, 
                  result.user_address,
          
                  
                  result.activity_name, 
                  result.activity_description, 
                  result.activity_duration,
          
                  
                  result.location_name
          ));
      } else {
          return Promise.reject("No matching results");
      }
  });
}


// test 

// getByClassId(2).then((classes) => {
//     console.log(classes)
// })

// test

export function getByClass(searchTerm) {
    return db_conn.query(
      `SELECT * FROM classes
        INNER JOIN location ON classes.class_location_id = location.location_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users ON classes.class_trainer_user_id = users.user_id
        WHERE activities.activity_name LIKE ? AND class_datetime >= NOW()`,
      [`%${searchTerm}%`]
    ).then(([queryResult]) => {
      return queryResult.map(
        result => newClassUserActivity(
            result.class_id,
                result.class_datetime, 
                result.class_location_id, 
                result.class_activity_id, 
                result.class_trainer_user_id,
        
                
                result.user_firstname, 
                result.user_lastname, 
                result.user_address,
        
                
                result.activity_name, 
                result.activity_description, 
                result.activity_duration,
        
                result.location_name
      )
      )
    })
  }


  // getByClass("Yoga").then(allClass => {
  //   console.log(allClass)
  // })
  
  export function getBySearchNameTrianer(searchTerm) {
    return db_conn.query(
      `SELECT * ,
      trainer.user_id AS trainer_id,
      trainer.user_firstname AS trainer_firstname,
      trainer.user_lastname AS trainer_lastname
      FROM classes 
        INNER JOIN location ON classes.class_location_id = location.location_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users AS trainer
        ON classes.class_trainer_user_id = trainer.user_id
      WHERE ( user_firstname LIKE ? OR user_lastname LIKE ? )`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        console.log(queryResult)
      return queryResult.map(
        result => newClassUserActivity(
            result.class_id,
                result.class_datetime, 
                result.class_location_id, 
                result.class_activity_id, 
                result.class_trainer_user_id,
        
                
                result.trainer_firstname, 
                result.trainer_lastname, 
                result.user_address,
        
                
                result.activity_name, 
                result.activity_description, 
                result.activity_duration,
        
                result.location_name
        )
      )
    })
  }
  
  
  ////////////////////// Teasting area (remove before use)//////
  
//   getBySearchNameTrianer("Ken")
// .then(allClass => {
//    console.log(allClass)
//  })
  
  
  /////////////////////////////////////////////////////////////



  export function getbydateweek(dateWeek) {
    return db_conn.query(
        `SELECT * FROM classes 
        INNER JOIN location ON classes.class_location_id = location.location_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users ON classes.class_trainer_user_id = users.user_id
        WHERE WEEK(class_datetime, 1) = ?`,
        [dateWeek]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newClassUserActivity(
              result.class_id,
              result.class_datetime, 
              result.class_location_id, 
              result.class_activity_id, 
              result.class_trainer_user_id,
      
              
              result.user_firstname, 
              result.user_lastname, 
              result.user_address,
      
              
              result.activity_name, 
              result.activity_description, 
              result.activity_duration,
      
              result.location_name
            )
        );
    });
}

 /////  testing ///

// getbydateweek("05")
// .then(allClass =>   //need to use then to get data
// {console.log(allClass)
// })

/////  testing /// 



  export function getByDateRange(startDate, endDate)  {
    return db_conn.query(
      `SELECT * FROM classes 
        INNER JOIN location ON classes.class_location_id = location.location_id
        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
        INNER JOIN users ON classes.class_trainer_user_id = users.user_id
      WHERE ( class_datetime BETWEEN ? AND ?)`,
      [startDate, endDate]
    ).then(([queryResult]) => {
        console.log(queryResult)
      return queryResult.map(
        result => newClassUserActivity(
            result.class_id,
                result.class_datetime, 
                result.class_location_id, 
                result.class_activity_id, 
                result.class_trainer_user_id,
        
                
                result.user_firstname, 
                result.user_lastname, 
                result.user_address,
        
                
                result.activity_name, 
                result.activity_description, 
                result.activity_duration,
        
                result.location_name
        )
      )
    })
  }
  
 /////  testing ///

// getByDateRange("2024-05-09", "2024-05-12")
// .then(allClass =>   //need to use then to get data
// {console.log(allClass)
// })

/////  testing /// 


// Get class by date
// export function getClassByDate(date) {
//   return db_conn.query(
//       `SELECT * FROM classes 
//        INNER JOIN location ON classes.class_location_id = location.location_id
//        INNER JOIN activities ON classes.class_activity_id = activities.activity_id
//        INNER JOIN users ON classes.class_trainer_user_id = users.user_id
//        WHERE DATE(class_datetime) = ?`, [date]
//   ).then(([queryResult]) => {
//       return queryResult.map(
//           result => newClassUserActivity(
//               result.class_id,
//               result.class_datetime,
//               result.class_location_id,
//               result.class_activity_id,
//               result.class_trainer_user_id,
//               result.user_firstname,
//               result.user_lastname,
//               result.user_address,
//               result.activity_name,
//               result.activity_description,
//               result.activity_duration,
//               result.location_name
//           )
//       );
//   });
// }

export function getClassByDate(date) {
  return db_conn.query(
    `SELECT * FROM classes 
     INNER JOIN location ON classes.class_location_id = location.location_id
     INNER JOIN activities ON classes.class_activity_id = activities.activity_id
     INNER JOIN users ON classes.class_trainer_user_id = users.user_id
     WHERE DATE(class_datetime) = ?`, [date]
  ).then(([queryResult]) => {
    return queryResult.map(result => {
      const classDatetime = new Date(result.class_datetime);
      return {
        class_id: result.class_id,
        activity_name: result.activity_name,
        class_datetime: result.class_datetime,
        // Format class date and time
        class_date: classDatetime.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        class_time: classDatetime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        location_name: result.location_name,
        trainer_firstname: result.user_firstname,  // Assuming trainer info is from users table
        trainer_lastname: result.user_lastname,  // Assuming trainer info is from users table
        trainer_email: result.user_email,  // Assuming trainer info is from users table
      };
    });
  });
}




export async function getByLocationAndDayOfWeek(location_id, dayOfWeek) {
  console.log(`Querying location_id: ${location_id}, dayOfWeek: ${dayOfWeek}`);
  return db_conn.query(
    `SELECT classes.*, activities.activity_name, location.location_name 
     FROM classes
     INNER JOIN activities ON classes.class_activity_id = activities.activity_id
     INNER JOIN location ON classes.class_location_id = location.location_id
     WHERE DAYOFWEEK(classes.class_datetime) = ? 
     AND classes.class_location_id = ? 
     AND classes.class_remove = 0
     `,
    [dayOfWeek, location_id]
  )
  .then(([results]) => results)
  .catch(error => {
    console.error("Error fetching classes by location and day:", error);
    throw error;
  });
}


export function getByDate(date) {
  return db_conn.query(
    `SELECT classes.class_id, classes.class_datetime, activities.activity_name, location.location_name
     FROM classes
     INNER JOIN activities ON classes.class_activity_id = activities.activity_id
     INNER JOIN location ON classes.class_location_id = location.location_id
     WHERE DATE(classes.class_datetime) = ?`, 
     
    [date]
  )
  .then(([queryResult]) => {
    console.log("Query Result:", queryResult); // Log to ensure data structure is correct
    return queryResult.map(result => ({
      class_id: result.class_id,
      class_datetime: result.class_datetime,
      activity_name: result.activity_name,
      location_name: result.location_name
    }));
  });
}




export function getAllLocation() {
	return db_conn
		.query(
			`
        SELECT DISTINCT location_id, location_name 
        FROM location
        `
		)
		.then(([queryResult]) => {
			return queryResult.map((result) => ({
				location_id: result.location_id,
				location_name: result.location_name,
			}));
		});
}



export function getAllTrainers() {
  return db_conn.query(`
    SELECT user_id AS trainer_id, 
           CONCAT(user_firstname, ' ', user_lastname) AS trainer_name
    FROM users  -- Change 'user' to 'users'
    WHERE user_role = 'trainer'
  `)
  .then(([queryResult]) => {
    return queryResult.map(result => ({
      trainer_id: result.trainer_id,
      trainer_name: result.trainer_name,
    }));
  });
}



export function getByLocationAndDate(location_id, selected_date) {
  return db_conn.query(
    `SELECT * FROM classes
     INNER JOIN location ON classes.class_location_id = location.location_id
     INNER JOIN activities ON classes.class_activity_id = activities.activity_id
     INNER JOIN users ON classes.class_trainer_user_id = users.user_id
     WHERE classes.class_location_id = ? AND DATE(classes.class_datetime) = ?`, 
    [location_id, selected_date]
  ).then(([queryResult]) => {
    return queryResult.map(result => {
      const classDatetime = new Date(result.class_datetime);
      return {
        class_id: result.class_id,
        activity_name: result.activity_name,
        class_datetime: result.class_datetime,
        class_date: classDatetime.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        class_time: classDatetime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
        location_name: result.location_name,
        trainer_firstname: result.user_firstname,
        trainer_lastname: result.user_lastname,
        trainer_email: result.user_email,
      };
    });
  });
}




export function getByClassTrainer(trainerId) {
  console.log(`Fetching classes for Trainer ID: ${trainerId}`); // Log trainer ID

  return db_conn.query(
    `SELECT * FROM classes 
     INNER JOIN location ON classes.class_location_id = location.location_id
     INNER JOIN activities ON classes.class_activity_id = activities.activity_id
     WHERE classes.class_trainer_user_id = ?`,
    [trainerId]
  )
  .then(([queryResult]) => {
    console.log("Query Result:", queryResult); // Log query result
    return queryResult;
  })
  .catch((error) => {
    console.error("Error in getByClassTrainer query:", error);
    throw error;
  });
}
