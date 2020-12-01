/**
Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.

For example, suppose your expense report contained the following:

1721
979
366
299
675
1456
In this list, the two entries that sum to 2020 are 1721 and 299. Multiplying them together produces 1721 * 299 = 514579, so the correct answer is 514579.

Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?

Your puzzle answer ?????
*/
answer1=(inputs)=>{
    const a={};
    for(x=0;x<inputs.length;x++){
     let num=inputs[x];
     let n2020 = 2020-num;  
     if(num>2020) continue;
     if(a[num] === true){
        return num*n2020}
      else {a[n2020]=true;}
    }
}

/**
--- Part Two ---
The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

In your expense report, what is the product of the three entries that sum to 2020?

Your puzzle answer ??????
*/

answer2=(inputs)=>{
 let inin={};
for(x=0;x<inputs.length;x++){
  for(y=x+1;y<inputs.length;y++){
    if(inputs[x]+inputs[y]<2020 && !inin[ 2020 - inputs[x]-inputs[y]])
     inin[ 2020 - inputs[x]-inputs[y]] = {a:inputs[x],b:inputs[y]};
  }}
  console.log(inin);
  let num=inputs.find(i=>inin[i]);
  if(num) return num*inin[num].a*inin[num].b
}
