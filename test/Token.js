// // const { expect } = require("chai");

// // describe("Token contract", function () {
// //   it("Deployment should assign the total supply of tokens to the owner", async function () {
// //     const [owner] = await ethers.getSigners();

// //     const hardhatToken = await ethers.deployContract("Token");

// //     const ownerBalance = await hardhatToken.balanceOf(owner.address);
// //     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
// //   });
// // });
// const { expect } = require("chai");

// describe("Token contract",function(){

//     it("Deployment should be assign the total supply of tokens to the owner",async function(){

//         const[owner]=await ethers.getSigners();

//         console.log("signers object :",owner);
//         const Token =await ethers.getContractFactory("Token");//instance contract

//         const hardhatToken =await Token.deploy();//deploy

//         const ownerBalance =await hardhatToken.balanceOf(owner.address);//owner balance =10000
//         console.log("Owner Address",owner.address);

//         expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);//total supply= 10000

//     });

//     it("should transfer tokens between account",async function(){

//         const[owner,addr1,addr2]=await ethers.getSigners();

//         const Token =await ethers.getContractFactory("Token");//instance contract

//         const hardhatToken =await Token.deploy();//deploy

//         await hardhatToken.transfer(addr1.address,10);
//         expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

//         await hardhatToken.connect(addr1).transfer(addr2.address,5);
//         expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
//     });

// });


const { expect } = require("chai");
// const{ethers} =require("ethers");
// const { ethers } = require("hardhat");

describe("Token Contract", function () {
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        const Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    });

    describe("deployment", function () {
        it("should set the right owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });
        it("should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("transactions", function () {
        it("should transfer tokens between accounts", async function () {
            await hardhatToken.transfer(addr1.address, 5);
            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5);

            await hardhatToken.connect(addr1).transfer(addr2.address, 5);
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(5);
        });
        it("should fail if sender doesnot have enough balance", async function () {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.revertedWith("Not enough tokens");
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
        it("should update balance after transfer", async function () {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 5);
            await hardhatToken.transfer(addr2.address, 10);
            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            console.log("ggtt:- ",finalOwnerBalance," jjuu");
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(15));
            // expect(finalOwnerBalance).to.equal(10000 - 15);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(5);

            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(10);
        });
    });
});