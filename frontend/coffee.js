$(document).ready(function() {

	//////////////////////////////////////////////////////////////////////////////
	////     INSERT YOUR NODE RPC URL, NETWORK ID AND GAS PRICE HERE        //////
	//////////////////////////////////////////////////////////////////////////////
	var rpcURL = "http://ethltjjnz-dns-reg1.northeurope.cloudapp.azure.com:8540";
	var networkID = 18263546;
	var minGasPrice = 0;
	//////////////////////////////////////////////////////////////////////////////
	////     INSERT THE TOKEN DETAILS HERE                                  //////
	//////////////////////////////////////////////////////////////////////////////
	var token_address = '0xeC820c7Fadb1139f855477E626CaE5Efa304227d';
	var token_amount = 10;
	var token_receiver = "0xed42e169cf99df087cdc19d845536359fc3f4a10";
	//////////////////////////////////////////////////////////////////////////////

	var account;
	var web3Provider;

	var contract_token;
	var contract_faucet;

	var balanceToken = 0;

	function initialize() {
		setAccount();
		setTokenBalance();
	}

	function setAccount() {
		web3.version.getNetwork(function(err, netId) {
			if (!err && netId == networkID) { 
				$("#wrong_network").fadeOut(1000);
				setTimeout(function(){ $("#correct_network").fadeIn(); $("#coffee").fadeIn(); }, 1000);
				account = web3.eth.accounts[0];
				$("#address").text(account);
			} 
		});
	}

	function setTokenBalance() {
		contract_token.balanceOf(web3.eth.accounts[0], function(err, result) {
			if(!err) {
				$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " Tokens");
				if(Number(result) != balanceToken) {
					balanceToken = Number(result);
					$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " Winter Tokens");
					if(web3.fromWei(balanceToken, 'ether') >= 10) {
						$("#requestButton").removeAttr('disabled');
					}
				}
			}
		});
	}

	function getCoffee() {
		$("#requestButton").attr('disabled', true);
		web3.eth.getTransactionCount(account, function(errNonce, nonce) {
			if(!errNonce) {
				contract_token.approve(token_receiver, web3.toWei(token_amount, 'ether'), {value: 0, gas: 100000, gasPrice: minGasPrice, from: account, nonce: nonce}, function(errCall, result) {
					if(!errCall) {
						testTokensRequested = true;
						$('#getTokens').hide();
					} else {
						testTokensRequested = true;
						$('#getTokens').hide();
					}
				});
			}
		});
	}

	$("#rpc_url").text(rpcURL);
	$("#network_id").text(networkID);

	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	}

	web3 = new Web3(web3Provider);

	$.getJSON('json/erc20.json', function(data) {
		contract_token = web3.eth.contract(data).at(token_address);
	});

	setTimeout(function(){ initialize(); }, 1000);

	let requestButton = document.querySelector('#requestButton');
	requestButton.addEventListener('click', function() {
		getCoffee();
	});
});