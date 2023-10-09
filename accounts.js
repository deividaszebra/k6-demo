// === Account list ===

let count = 0;

export function uniqueEmail(){
let userMails = ["stress@test1.com", "stress@test2.com", "stress@test3.com", "stress@test4.com", "stress@test5.com", "stress@test6.com", "stress@test7.com", "stress@test8.com", "stress@test9.com", "stress@test10.com"];

count++;
if(count>10){
count = 1;
}
return `stress@test${count}.com`;

//console.log(randomEmail);

}